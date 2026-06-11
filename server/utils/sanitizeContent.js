const sanitizeHtml = require("sanitize-html");

// Allowlist mirrors the React Quill toolbar (bold, italic, underline,
// ordered/bullet lists, links). Everything else is stripped so stored
// note content can never carry executable markup (defense against XSS).
const SANITIZE_OPTIONS = {
  allowedTags: ["p", "br", "b", "strong", "i", "em", "u", "s", "ol", "ul", "li", "a"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
  },
};

const sanitizeContent = (content) => {
  if (typeof content !== "string") return content;
  return sanitizeHtml(content, SANITIZE_OPTIONS);
};

module.exports = sanitizeContent;
