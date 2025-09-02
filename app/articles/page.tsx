import React from "react";

import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";
import Client_content from "./content";
// import Comment_section from "@/components/giscus_comment";
export const metadata = {
  title: "markdown and latex rendering",
  description: "test markdown and latex rendering",
};
export default function App() {
  return (
    <div >
      <BackgroundBeamsWithCollision />
      <Client_content />
      {/* <Comment_section /> */}
    </div>
  );
}
