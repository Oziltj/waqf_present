import { Video } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const SOURCE = "source-copy.mp4";

type ClipSceneProps = {
  accent: string;
  align: "left" | "right";
  durationInFrames: number;
  label: string;
  startFrame: number;
  tone: string;
  zoom: number;
};

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const CopyLine: React.FC<{
  align: "left" | "right";
  accent: string;
  kicker: string;
  title: string;
}> = ({ align, accent, kicker, title }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [8, 34], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });

  return (
    <div
      className={`copy copy-${align}`}
      style={{
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [42, 0])}px)`,
      }}
    >
      <div className="rule" style={{ backgroundColor: accent }} />
      <div className="kicker">{kicker}</div>
      <div className="title">{title}</div>
    </div>
  );
};

const VideoLayer: React.FC<{
  durationInFrames: number;
  startFrame: number;
  zoom: number;
  muted?: boolean;
}> = ({ durationInFrames, startFrame, zoom, muted = false }) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [0, durationInFrames], [0, 1], clamp);
  const opacity = Math.min(
    interpolate(frame, [0, 16], [0, 1], clamp),
    interpolate(
      frame,
      [durationInFrames - 18, durationInFrames],
      [1, 0.78],
      clamp,
    ),
  );

  return (
    <Video
      src={staticFile(SOURCE)}
      objectFit="cover"
      trimBefore={startFrame}
      trimAfter={startFrame + durationInFrames + 20}
      volume={(localFrame) =>
        muted
          ? 0
          : Math.min(
              interpolate(localFrame, [0, 20], [0, 0.82], clamp),
              interpolate(
                localFrame,
                [durationInFrames - 24, durationInFrames],
                [0.82, 0.15],
                clamp,
              ),
            )
      }
      style={{
        width: "100%",
        height: "100%",
        opacity,
        transform: `scale(${zoom + move * 0.035}) translateX(${interpolate(
          move,
          [0, 1],
          [-18, 18],
        )}px)`,
      }}
    />
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const titleProgress = interpolate(frame, [5, 32], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });
  const veil = interpolate(frame, [0, durationInFrames], [0.72, 0.35], clamp);

  return (
    <AbsoluteFill className="scene">
      <VideoLayer
        durationInFrames={durationInFrames}
        startFrame={0}
        zoom={1.08}
        muted
      />
      <AbsoluteFill className="grain" />
      <AbsoluteFill className="intro-wash" style={{ opacity: veil }} />
      <div
        className="intro-title"
        style={{
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [52, 0])}px)`,
        }}
      >
        <span>WAQF</span>
        <strong>АМОНАТИ ИСЛОМӢ</strong>
      </div>
      <div className="intro-tag">пасандозҳо тибқи принсипҳои шариат</div>
    </AbsoluteFill>
  );
};

const ClipScene: React.FC<ClipSceneProps> = ({
  accent,
  align,
  durationInFrames,
  label,
  startFrame,
  tone,
  zoom,
}) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(
    frame,
    [12, durationInFrames - 12],
    [-35, 110],
    clamp,
  );

  return (
    <AbsoluteFill className="scene">
      <VideoLayer
        durationInFrames={durationInFrames}
        startFrame={startFrame}
        zoom={zoom}
      />
      <AbsoluteFill className="grain" />
      <AbsoluteFill
        className="tone"
        style={{
          background: tone,
        }}
      />
      <div
        className="light-sweep"
        style={{
          left: `${sweep}%`,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />
      <CopyLine
        align={align}
        accent={accent}
        kicker={label}
        title={
          align === "left"
            ? "Манфиати ҳалол бе фоиз"
            : "Сармояи шумо ахлоқӣ кор мекунад"
        }
      />
    </AbsoluteFill>
  );
};

const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 26], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    ...clamp,
  });

  return (
    <AbsoluteFill className="outro">
      <VideoLayer durationInFrames={70} startFrame={230} zoom={1.12} muted />
      <AbsoluteFill className="grain" />
      <AbsoluteFill className="outro-shade" />
      <div
        className="outro-copy"
        style={{
          opacity: enter,
          transform: `scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        }}
      >
        <span>Амонати исломӣ</span>
        <strong>Оромӣ. Эътимод. Баракат.</strong>
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition = () => {
  const t15 = linearTiming({ durationInFrames: 15 });
  const t18 = linearTiming({ durationInFrames: 18 });

  return (
    <AbsoluteFill className="canvas">
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={45}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t15} />
        <TransitionSeries.Sequence durationInFrames={105}>
          <ClipScene
            accent="rgba(255, 195, 83, 0.62)"
            align="left"
            durationInFrames={105}
            label="пасандозҳои ҳалол"
            startFrame={8}
            tone="linear-gradient(115deg, rgba(8, 10, 12, 0.08), rgba(251, 132, 76, 0.2), rgba(2, 170, 186, 0.12))"
            zoom={1.02}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={t18}
        />
        <TransitionSeries.Sequence durationInFrames={105}>
          <ClipScene
            accent="rgba(67, 221, 181, 0.54)"
            align="right"
            durationInFrames={105}
            label="шартҳои шаффоф"
            startFrame={82}
            tone="linear-gradient(225deg, rgba(6, 7, 9, 0.18), rgba(15, 148, 136, 0.18), rgba(241, 80, 93, 0.1))"
            zoom={1.14}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t15} />
        <TransitionSeries.Sequence durationInFrames={105}>
          <ClipScene
            accent="rgba(237, 88, 115, 0.54)"
            align="left"
            durationInFrames={105}
            label="саҳм ба оянда"
            startFrame={165}
            tone="linear-gradient(145deg, rgba(11, 11, 13, 0.2), rgba(237, 88, 115, 0.18), rgba(244, 205, 96, 0.12))"
            zoom={1.06}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={t15} />
        <TransitionSeries.Sequence durationInFrames={63}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
