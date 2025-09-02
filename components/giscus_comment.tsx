import Giscus from "@giscus/react";

// 定义符合Giscus要求的StrictType
type StrictType = "0" | "1";

export default function Comment_section() {
  return (
    <Giscus
      repo="Moeus/Blog-comment-section"
      repoId="R_kgDOPoOZ2Q"
      category="General"
      categoryId="DIC_kwDOPoOZ2c4Cu3Y2"
      mapping="title"
      // 使用正确的类型值 "0" 或 "1" 而不是 "false" 或 "true"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
      loading="lazy"
    />
  );
}
