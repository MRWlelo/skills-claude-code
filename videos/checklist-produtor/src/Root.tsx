import { Composition } from "remotion";
import { ChecklistProdutor } from "./ChecklistProdutor";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ChecklistProdutor"
      component={ChecklistProdutor}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        // Coloque a cena realista em public/cena.mp4 e troque para "cena.mp4".
        // Vazio = fundo ilustrado (capô + caderno).
        cena: "",
        gancho: "3 coisas pra fazer antes de 2027",
        ganchoApoio: "— a terceira quase todo mundo esquece.",
        itens: [
          "Saber meu faturamento",
          "Simular com contador",
          "Organizar notas e créditos",
        ],
        cta: "Salva e compartilha no grupo de produtores.",
      }}
    />
  );
};
