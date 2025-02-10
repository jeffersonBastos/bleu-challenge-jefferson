import { placeholder } from "@bleu-builders/tech-challenge-ui";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>{placeholder ? "true" : "false"}</p>
    </div>
  );
}
