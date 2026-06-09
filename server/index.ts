import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import textToSpeech from "@google-cloud/text-to-speech";
import { toChirp3Markup, toNeural2Ssml } from "./naturalizeSpeech";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? process.env.TTS_PORT ?? 3001);
const distPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../dist",
);

const NEURAL2_FALLBACK_VOICE = "ko-KR-Neural2-A";
const DEFAULT_CHIRP3_VOICE = "ko-KR-Chirp3-HD-Kore";

function createTtsClient() {
  const jsonCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (jsonCredentials) {
    try {
      return new textToSpeech.TextToSpeechClient({
        credentials: JSON.parse(jsonCredentials) as object,
      });
    } catch (error) {
      console.error("[tts] Invalid GOOGLE_SERVICE_ACCOUNT_JSON:", error);
      return null;
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new textToSpeech.TextToSpeechClient();
  }

  return null;
}

const ttsClient = createTtsClient();

app.use(cors());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    ttsConfigured: Boolean(ttsClient),
  });
});

type SynthesisInput = {
  voiceName: string;
  speakingRate: number;
  pitch: number;
  text: string;
};

async function synthesize({
  voiceName,
  speakingRate,
  pitch,
  text,
}: SynthesisInput) {
  if (!ttsClient) {
    throw new Error("TTS client not configured");
  }

  const isChirp3 = voiceName.includes("Chirp3-HD");
  const input = isChirp3
    ? { markup: toChirp3Markup(text) }
    : { ssml: toNeural2Ssml(text) };

  const [response] = await ttsClient.synthesizeSpeech({
    input,
    voice: {
      languageCode: "ko-KR",
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: Math.min(1.15, Math.max(0.85, speakingRate)),
      pitch: isChirp3 ? 0 : Math.min(4, Math.max(-4, pitch)),
      sampleRateHertz: 24000,
      effectsProfileId: ["headphone-class-device"],
    },
  });

  if (!response.audioContent) {
    throw new Error("Empty audio response from Google TTS");
  }

  return typeof response.audioContent === "string"
    ? Buffer.from(response.audioContent, "base64")
    : Buffer.from(response.audioContent);
}

app.post("/api/tts", async (req, res) => {
  if (!ttsClient) {
    res.status(503).json({
      error:
        "Google Cloud TTS is not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
    });
    return;
  }

  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const voiceName =
    typeof req.body?.voiceName === "string"
      ? req.body.voiceName
      : DEFAULT_CHIRP3_VOICE;
  const speakingRate =
    typeof req.body?.speakingRate === "number" ? req.body.speakingRate : 0.96;
  const pitch = typeof req.body?.pitch === "number" ? req.body.pitch : 0;

  if (!text) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    let audio: Buffer;

    try {
      audio = await synthesize({ voiceName, speakingRate, pitch, text });
    } catch (primaryError) {
      if (
        voiceName.includes("Chirp3-HD") &&
        voiceName !== NEURAL2_FALLBACK_VOICE
      ) {
        console.warn("[tts] Chirp3 failed, falling back to Neural2:", primaryError);
        audio = await synthesize({
          voiceName: NEURAL2_FALLBACK_VOICE,
          speakingRate: Math.min(1.05, Math.max(0.9, speakingRate)),
          pitch: 0,
          text,
        });
      } else {
        throw primaryError;
      }
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "private, max-age=3600");
    res.send(audio);
  } catch (error) {
    console.error("[tts]", error);
    res.status(502).json({ error: "Google TTS synthesis failed" });
  }
});

if (isProduction) {
  app.use(express.static(distPath, { index: false }));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      next();
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.status(404).end();
      return;
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(
    `[server] http://0.0.0.0:${port} (production: ${isProduction}, tts: ${Boolean(ttsClient)})`,
  );
});
