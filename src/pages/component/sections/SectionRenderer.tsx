import { Lesson, LessonSection } from "@/types";
import React from "react";
import VideoSection from "./VideoSection";
import ReadingSection from "./ReadingSection";
import SpeakingSection from "./SpeakingSection";
import GrammarSection from "./GrammarSection";
import ListeningSection from "./ListeningSection";
import QuizSection from "./QuizSection";

interface Props {
  section: LessonSection;
  song: Lesson;
}

export const SectionRenderer: React.FC<Props> = ({ section, song }) => {
  switch (section.key) {
    case "video":
      if (!song.video) return null;
      return <VideoSection video={song.video} lyric={song.lyric} />;

    case "reading":
      if (!song.readingtasks?.length) return null;
      return <ReadingSection tasks={song.readingtasks} />;

    case "speaking":
      if (!song.tasks?.wordPairs) return null;
      return <SpeakingSection tasks={song.tasks} />;

    case "grammar":
      return <GrammarSection />;

    case "listening":
      if (!song.listeningtasks?.length) return null;
      return <ListeningSection tasks={song.listeningtasks} />;

    case "quiz":
      if (!song.testyourself) return null;
      return <QuizSection test={song.testyourself} />;

    default:
      return null;
  }
};
