import { splitTextByMatch } from "../../utils/highlightUtils";
import "./HighlightedText.css";

function HighlightedText({ text, query }) {
  const parts = splitTextByMatch(text, query);

  return (
    <>
      {parts.map((part, index) =>
        part.isMatch ? (
          <mark key={index} className="highlighted-text">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </>
  );
}

export default HighlightedText;