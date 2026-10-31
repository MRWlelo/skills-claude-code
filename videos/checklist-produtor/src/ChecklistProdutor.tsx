import { Video } from "@remotion/media";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadArchivo } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: mao } = loadCaveat("normal", {
  weights: ["700"],
  subsets: ["latin"],
});
const { fontFamily: titulo } = loadArchivo("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const { fontFamily: sans } = loadInter("normal", {
  weights: ["600", "800"],
  subsets: ["latin"],
});

const COR = {
  papel: "#f6efdc",
  tinta: "#1f3f8f",
  verde: "#2f7d32",
  amarelo: "#ffc93c",
  escuro: "#141414",
  branco: "#ffffff",
};

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type Props = {
  readonly cena: string;
  readonly gancho: string;
  readonly ganchoApoio: string;
  readonly itens: readonly string[];
  readonly cta: string;
};

export const ChecklistProdutor: React.FC<Props> = ({
  cena,
  gancho,
  ganchoApoio,
  itens,
  cta,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COR.escuro }}>
      <Fundo cena={cena} />
      <Sequence name="Gancho" from={0} durationInFrames={3.5 * fps}>
        <Gancho gancho={gancho} apoio={ganchoApoio} />
      </Sequence>
      <Sequence name="Checklist" from={3 * fps} durationInFrames={9.5 * fps}>
        <Checklist itens={itens} />
      </Sequence>
      <Sequence name="CTA" from={12 * fps} durationInFrames={3 * fps}>
        <Cta texto={cta} />
      </Sequence>
    </AbsoluteFill>
  );
};

/* ---------- Fundo: cena realista (se houver) ou capô ilustrado ---------- */

const Fundo: React.FC<{ readonly cena: string }> = ({ cena }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, durationInFrames], [1, 1.12]),
      }}
    >
      {cena ? (
        <Video
          src={staticFile(cena)}
          muted
          loop
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <CapoIlustrado />
      )}
      {/* Escurece topo e base para o texto ler bem */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const CapoIlustrado: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        // Lataria vermelha gasta, luz da manhã vindo do canto superior esquerdo
        background:
          "radial-gradient(120% 80% at 15% 5%, rgba(255,214,140,0.55) 0%, rgba(255,214,140,0) 55%), linear-gradient(160deg, #a3352a 0%, #7d241c 55%, #4d1510 100%)",
      }}
    >
      {/* Poeira / textura */}
      <AbsoluteFill
        style={{
          opacity: 0.25,
          backgroundImage:
            "radial-gradient(rgba(255,240,210,0.6) 1px, transparent 1.5px)",
          backgroundSize: "7px 9px",
        }}
      />
      {/* Caderno */}
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 380,
          width: 860,
          height: 1180,
          rotate: "-4deg",
          backgroundColor: COR.papel,
          borderRadius: 10,
          boxShadow: "40px 50px 60px rgba(0,0,0,0.45)",
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 78px, rgba(60,110,190,0.35) 78px, rgba(60,110,190,0.35) 81px)",
          backgroundPosition: "0 40px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: "rgba(210,60,60,0.55)",
          }}
        />
      </div>
      {/* Sombra suave da luz da manhã */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- Cena 1: gancho ---------- */

const Gancho: React.FC<{ readonly gancho: string; readonly apoio: string }> = ({
  gancho,
  apoio,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const saida = interpolate(
    frame,
    [durationInFrames - 0.4 * fps, durationInFrames],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: "0 90px",
        opacity: saida,
      }}
    >
      <div
        style={{
          backgroundColor: COR.amarelo,
          color: COR.escuro,
          fontFamily: titulo,
          fontSize: 104,
          lineHeight: 1.05,
          padding: "40px 48px",
          borderRadius: 18,
          rotate: "-2deg",
          boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
          scale: interpolate(frame, [0, 0.5 * fps], [0.6, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 0.2 * fps], [0, 1], clamp),
        }}
      >
        {gancho}
      </div>
      <div
        style={{
          marginTop: 48,
          color: COR.branco,
          fontFamily: sans,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.2,
          textShadow: "0 4px 18px rgba(0,0,0,0.7)",
          opacity: interpolate(frame, [0.9 * fps, 1.3 * fps], [0, 1], clamp),
          translate: interpolate(
            frame,
            [0.9 * fps, 1.3 * fps],
            ["0px 30px", "0px 0px"],
            { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
          ),
        }}
      >
        {apoio}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Cena 2: checklist ---------- */

const Checklist: React.FC<{ readonly itens: readonly string[] }> = ({ itens }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const passo = 2.7 * fps;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: "0 80px",
        opacity: interpolate(
          frame,
          [0, 0.4 * fps, durationInFrames - 0.4 * fps, durationInFrames],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(246,239,220,0.96)",
          borderRadius: 24,
          padding: "56px 56px 40px",
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          rotate: "-1.5deg",
        }}
      >
        <div
          style={{
            fontFamily: titulo,
            fontSize: 64,
            color: COR.escuro,
            marginBottom: 24,
          }}
        >
          Checklist do produtor
        </div>
        {itens.map((item, i) => (
          <Sequence
            key={item}
            name={`Item ${i + 1}`}
            from={0.5 * fps + i * passo}
            layout="none"
          >
            <Item numero={i + 1} texto={item} destaque={i === itens.length - 1} />
          </Sequence>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Item: React.FC<{
  readonly numero: number;
  readonly texto: string;
  readonly destaque: boolean;
}> = ({ numero, texto, destaque }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Escrita da esquerda pra direita, depois o "check"
  const escrita = interpolate(frame, [0, 1.1 * fps], [0, 100], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const check = interpolate(frame, [1.3 * fps, 1.7 * fps], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <div style={{ padding: "18px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width={84} height={84} viewBox="0 0 84 84" style={{ flexShrink: 0 }}>
          <rect
            x={6}
            y={6}
            width={72}
            height={72}
            rx={10}
            fill="none"
            stroke={COR.escuro}
            strokeWidth={6}
          />
          <path
            d="M18 44 L36 62 L72 14"
            fill="none"
            stroke={COR.verde}
            strokeWidth={11}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={check}
          />
        </svg>
        <div
          style={{
            fontFamily: mao,
            fontWeight: 700,
            fontSize: 84,
            lineHeight: 1.05,
            color: COR.tinta,
            clipPath: `inset(-20px ${100 - escrita}% -20px 0)`,
          }}
        >
          {numero}. {texto}
        </div>
      </div>
      {destaque ? (
        <div
          style={{
            marginLeft: 112,
            marginTop: 14,
            display: "inline-block",
            backgroundColor: "#d93025",
            color: COR.branco,
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 44,
            padding: "10px 22px",
            borderRadius: 12,
            opacity: interpolate(frame, [1.8 * fps, 2.1 * fps], [0, 1], clamp),
            scale: interpolate(frame, [1.8 * fps, 2.3 * fps], [0.7, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 10 }),
              output: "perceptual-scale",
            }),
          }}
        >
          quase todo mundo esquece!
        </div>
      ) : null}
    </div>
  );
};

/* ---------- Cena 3: CTA ---------- */

const Cta: React.FC<{ readonly texto: string }> = ({ texto: frase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        backgroundColor: `rgba(20,20,20,${interpolate(frame, [0, 0.4 * fps], [0, 0.78], clamp)})`,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 40,
          marginBottom: 56,
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], clamp),
          scale: interpolate(frame, [0, 0.5 * fps], [0.5, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 11 }),
            output: "perceptual-scale",
          }),
        }}
      >
        <Icone>
          <path d="M18 8 h28 v50 l-14 -10 l-14 10 z" />
        </Icone>
        <Icone>
          <path d="M8 34 L56 10 L44 56 L32 38 Z M32 38 L56 10" />
        </Icone>
      </div>
      <div
        style={{
          color: COR.branco,
          fontFamily: titulo,
          fontSize: 92,
          lineHeight: 1.1,
          textAlign: "center",
          textShadow: "0 6px 24px rgba(0,0,0,0.7)",
          opacity: interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], clamp),
          translate: interpolate(
            frame,
            [0.2 * fps, 0.6 * fps],
            ["0px 40px", "0px 0px"],
            { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) },
          ),
        }}
      >
        {frase}
      </div>
    </AbsoluteFill>
  );
};

const Icone: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 150,
      height: 150,
      borderRadius: 999,
      backgroundColor: COR.amarelo,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    }}
  >
    <svg
      width={78}
      height={78}
      viewBox="0 0 64 64"
      fill="none"
      stroke={COR.escuro}
      strokeWidth={6}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {children}
    </svg>
  </div>
);
