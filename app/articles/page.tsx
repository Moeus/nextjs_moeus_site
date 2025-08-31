"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";

import { ArticleDisplay } from "@/components/article_display";

// Sample article data
const sampleArticle = {
  index: 1,
  doc_title: "Introduction to Markdown and LaTeX",
  doc_content: `
# Markdown Basics

This is a sample article demonstrating Markdown rendering with **bold text**, *italic text*, and [links](https://example.com).

## Code Examples

Here's a JavaScript code example:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

And here's some Python:

\`\`\`python
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)
        
print(factorial(5))  # Output: 120
\`\`\`

## LaTeX Math Formulas

Inline math: $E = mc^2$

Display math:

$$
\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}
$$

$$
\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)
$$

## Lists

Unordered list:
- Item 1
- Item 2
  - Nested item
- Item 3

Ordered list:
1. First step
2. Second step
3. Third step

## Tables

| Name | Age | Occupation |
|------|-----|------------|
| John | 28  | Developer  |
| Jane | 32  | Designer   |
| Bob  | 45  | Manager    |

## Blockquotes

> This is a blockquote.
> It can span multiple lines.

## Images

![Sample Image](https://img.heroui.chat/image/landscape?w=800&h=400&u=1)
`,
  update_taime: new Date("2023-12-15T14:30:00"),
  autor: "John Doe",
  docid: "md-intro-001",
};

export default function App() {
  return (
    <div className="max-h-screen bg-background p-4 md:p-8">
      {/* 1. 放宽最大宽度：max-w-6xl（更宽）或 max-w-none（全屏） */}
      <div className="max-w-6xl mx-auto">
        {/* 2. 给 Card 加 max-w-full，确保不被内部限制 */}
        <Card className="shadow-md max-w-full">
          {/* 3. 调整 CardBody 内边距（可选）：默认 padding 可能过大，用 p-6 替代默认值 */}
          <CardBody className="p-6 md:p-8">
            <ArticleDisplay {...sampleArticle} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
