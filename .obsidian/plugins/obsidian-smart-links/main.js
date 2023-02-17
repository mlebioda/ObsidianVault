/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SmartLinks
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// replacements.ts
var SmartLinksPattern = class {
  constructor(pattern, replacement) {
    this.boundary = /(^| |\t|\n)$/;
    this.regexp = new RegExp(pattern);
    this.replacement = replacement;
  }
  match(text) {
    var _a;
    const match = text.match(this.regexp);
    if (match) {
      const preceding = text.charAt(((_a = match.index) != null ? _a : 0) - 1);
      if (preceding.match(this.boundary)) {
        return match;
      }
    }
    return null;
  }
};
function parseNextLink(text, pattern) {
  var _a;
  let result, href;
  result = pattern.match(text);
  if (result) {
    href = result[0].replace(pattern.regexp, pattern.replacement);
  }
  if (!result || !href) {
    return { found: false, remaining: text };
  }
  const preText = text.slice(0, result.index);
  const link = result[0];
  const remaining = text.slice(((_a = result.index) != null ? _a : 0) + link.length);
  return { found: true, preText, link, href, remaining };
}

// main.ts
var DEFAULT_SETTINGS = {
  patterns: [
    { regexp: "T(\\d+)", replacement: "https://phabricator.wikimedia.org/T$1" }
  ]
};
var isTextNodeMatchingLinkPatterns = (n, ps) => {
  if (n.nodeType !== n.TEXT_NODE) {
    return false;
  }
  for (const pattern of ps) {
    if (n.textContent && pattern.match(n.textContent)) {
      return true;
    }
  }
  return false;
};
var SmartLinks = class extends import_obsidian.Plugin {
  constructor() {
    super(...arguments);
    this.patterns = [];
    this.anyReplacableNodes = (el) => {
      for (let i = 0; i < el.childNodes.length; i++) {
        const child = el.childNodes[i];
        if (isTextNodeMatchingLinkPatterns(child, this.patterns)) {
          return true;
        }
      }
      return false;
    };
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new SmartLinksSettingTab(this.app, this));
    this.registerMarkdownPostProcessor((element, context) => {
      element.querySelectorAll("p, li").forEach((el) => {
        if (this.anyReplacableNodes(el)) {
          context.addChild(new SmartLinkContainer(el, this));
        }
      });
    });
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.rebuildPatterns();
  }
  async saveSettings() {
    await this.saveData(this.settings);
    this.rebuildPatterns();
  }
  rebuildPatterns() {
    this.patterns = [];
    this.settings.patterns.forEach((pattern) => {
      try {
        this.patterns.push(new SmartLinksPattern(pattern.regexp, pattern.replacement));
      } catch (e) {
      }
    });
  }
};
var SmartLinksSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  refresh() {
    this.display();
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Settings for Smart Links" });
    this.plugin.settings.patterns.forEach((pattern, index) => {
      const data2 = { ...pattern };
      const setting2 = this.makePatternRow(containerEl, `#${index}`, data2).addButton((button) => {
        button.setButtonText("Save").onClick(async (evt) => {
          this.plugin.settings.patterns[index] = data2;
          await this.plugin.saveSettings();
          this.refresh();
        });
      }).addButton((button) => {
        button.setButtonText("Remove").setClass("settings-delete-btn").onClick(async (evt) => {
          this.plugin.settings.patterns.splice(index, 1);
          await this.plugin.saveSettings();
          this.refresh();
        });
      });
    });
    const data = { regexp: "", replacement: "" };
    const setting = this.makePatternRow(containerEl, "New", data).addButton((button) => {
      button.setButtonText("Add").onClick(async (evt) => {
        if (!(data.regexp && data.replacement) || setting.controlEl.querySelector(".smart-links-setting-error")) {
          return;
        }
        this.plugin.settings.patterns.push(data);
        await this.plugin.saveSettings();
        this.refresh();
      });
    });
  }
  makePatternRow(containerEl, label, data) {
    const rowClass = "smart-links-setting-section";
    const setting = new import_obsidian.Setting(containerEl).setClass(rowClass);
    setting.setName(label);
    setting.addText((text) => {
      text.setValue(data.regexp).setPlaceholder("Regular expression").onChange((value) => {
        try {
          new RegExp(`\\b${value}`);
          text.inputEl.removeClass("smart-links-setting-error");
        } catch (error) {
          text.inputEl.addClass("smart-links-setting-error");
        }
        data.regexp = value;
      });
    });
    setting.addText((text) => {
      text.setValue(data.replacement).setPlaceholder("Replacement").onChange((value) => {
        try {
          const regexp = new RegExp(`\\b${data.regexp}`);
          "Arbitrary text".replace(regexp, value);
          text.inputEl.removeClass("smart-links-setting-error");
        } catch (error) {
          text.inputEl.addClass("smart-links-setting-error");
        }
        data.replacement = value;
      });
    });
    return setting;
  }
};
var SmartLinkContainer = class extends import_obsidian.MarkdownRenderChild {
  constructor(containerEl, plugin) {
    super(containerEl);
    this.plugin = plugin;
  }
  onload() {
    for (let pattern of this.plugin.patterns) {
      this.containerEl.setChildrenInPlace(this.buildNodeReplacements(this.containerEl, pattern));
    }
  }
  buildNodeReplacements(containerEl, pattern) {
    const results = [];
    containerEl.childNodes.forEach((node) => {
      if (!isTextNodeMatchingLinkPatterns(node, this.plugin.patterns)) {
        results.push(node);
        return;
      }
      let remaining = node.textContent || "";
      while (remaining) {
        const nextLink = parseNextLink(remaining, pattern);
        if (!nextLink.found) {
          results.push(document.createTextNode(nextLink.remaining));
          break;
        }
        results.push(document.createTextNode(nextLink.preText));
        results.push(this.createLinkTag(containerEl, nextLink.link, nextLink.href));
        remaining = nextLink.remaining;
      }
    });
    return results;
  }
  createLinkTag(el, link, href) {
    return el.createEl("a", {
      cls: "external-link",
      href,
      text: link,
      attr: {
        "aria-label": href,
        "aria-label-position": "top",
        rel: "noopener",
        target: "_blank"
      }
    });
  }
};
