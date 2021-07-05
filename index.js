"use strict";

const arvish = require("arvish");
const mdnDocBase = "https://developer.mozilla.org";

arvish
  .fetch(`${mdnDocBase}/api/v1/search/en-US?q=${arvish.input}`, { transform })
  .then((results) => {
    const items = (results || []).map((result) => {
      const { title, highlight, mdn_url } = result;
      const excerpt =
        highlight && highlight.body && highlight.body.length > 0
          ? highlight.body[0]
          : "";
      const subtitle = stripHtml(excerpt);
      const url = `${mdnDocBase}${mdn_url}`;

      return {
        title,
        subtitle,
        autoComplete: title,
        arg: url,
        quicklookurl: url,
      };
    });

    // No results
    if (items.length === 0) {
      const url = `${mdnDocBase}/en-US/search?q=${arvish.input}`;

      items.push({
        title: `Show all results for '${arvish.input}'`,
        arg: url,
        quicklookurl: url,
      });
    }

    arvish.output(items);
  });

function transform(body) {
  return body.documents;
}

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, "");
}
