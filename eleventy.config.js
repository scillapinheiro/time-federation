export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Newest release first
  eleventyConfig.addFilter("byReleaseDesc", (items) =>
    [...items].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
  );

  // Pick the field for the current language, falling back to English
  eleventyConfig.addFilter("t", (value, lang) => {
    if (value && typeof value === "object") return value[lang] ?? value.en;
    return value;
  });

  eleventyConfig.addFilter("chars", (str, length) =>
    String(str).toUpperCase().padEnd(length, " ").slice(0, length).split("")
  );

  eleventyConfig.addFilter("range", (from, to) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i)
  );

  // Shows split by the build date: upcoming soonest first, past most recent first
  eleventyConfig.addFilter("upcoming", (shows, today) =>
    shows.filter((s) => s.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  );
  eleventyConfig.addFilter("past", (shows, today) =>
    shows.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date))
  );

  eleventyConfig.addGlobalData("build", () => ({
    year: new Date().getFullYear(),
    today: new Date().toISOString().slice(0, 10),
    preview: process.env.PREVIEW === "1",
  }));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
