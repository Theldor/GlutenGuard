import { useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { X, Plus, Trash2, Edit2, Bold, Eye, EyeOff } from "lucide-react";
import { useApp } from "../store";

interface CardSection {
  id: string;
  label: string;
  content: string;
  fontSize: number;
  isBold: boolean;
  isVisible: boolean;
  isEditable: boolean; // Some sections like "Languages" shouldn't be editable via text
}

export function EditCardPage() {
  const nav = useNavigate();
  const { profile, setProfile } = useApp();

  // Load from profile or use defaults
  const [sections, setSections] = useState<CardSection[]>([
    {
      id: "languages",
      label: "Languages I speak",
      content: profile.spokenLanguages || "English",
      fontSize: 16,
      isBold: false,
      isVisible: true,
      isEditable: false,
    },
    {
      id: "primary",
      label: "Primary restriction",
      content: "I have celiac disease. I cannot eat anything containing wheat, barley, rye, or oats.",
      fontSize: 20,
      isBold: false,
      isVisible: true,
      isEditable: true,
    },
    {
      id: "cross-contamination",
      label: "Cross-contamination warning",
      content: getCrossContaminationText(profile.crossContamination),
      fontSize: 18,
      isBold: true,
      isVisible: true,
      isEditable: true,
    },
    {
      id: "safe-foods",
      label: "Safe ingredients I CAN eat",
      content: "Rice, corn, potatoes, vegetables, fruit, meat, fish, eggs, dairy, beans",
      fontSize: 18,
      isBold: true,
      isVisible: true,
      isEditable: true,
    },
  ]);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [safeFoodTagsDraft, setSafeFoodTagsDraft] = useState<string[]>([]);
  const [safeFoodInput, setSafeFoodInput] = useState("");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    profile.spokenLanguages?.split(", ") || ["English"]
  );

  const availableLanguages = [
    "English", "Spanish", "French", "German", "Italian",
    "Japanese", "Korean", "Chinese", "Portuguese", "Arabic",
    "Russian", "Hindi", "Thai", "Vietnamese", "Dutch"
  ];

  const handleEditSection = (id: string, currentContent: string) => {
    setEditingSection(id);
    setEditingContent(currentContent);
    if (id === "safe-foods") {
      setSafeFoodTagsDraft(parseSafeFoodTags(currentContent));
      setSafeFoodInput("");
    }
  };

  const handleSaveEdit = (id: string) => {
    const contentToSave =
      id === "safe-foods" ? safeFoodTagsDraft.join(", ") : editingContent;
    setSections(sections.map(s =>
      s.id === id ? { ...s, content: contentToSave } : s
    ));
    setEditingSection(null);
    setEditingContent("");
    setSafeFoodTagsDraft([]);
    setSafeFoodInput("");
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingContent("");
    setSafeFoodTagsDraft([]);
    setSafeFoodInput("");
  };

  const handleToggleVisibility = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    ));
  };

  const handleToggleBold = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, isBold: !s.isBold } : s
    ));
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handleAddCustomSection = () => {
    const newSection: CardSection = {
      id: `custom-${Date.now()}`,
      label: "Custom section",
      content: "Add your content here",
      fontSize: 16,
      isBold: false,
      isVisible: true,
      isEditable: true,
    };
    setSections([...sections, newSection]);
  };

  const addSafeFoodTags = (words: string[]) => {
    if (words.length === 0) return;
    setSafeFoodTagsDraft(prev => {
      const next = [...prev];
      words.forEach(word => {
        const normalized = word.trim().replace(/,+$/, "");
        if (normalized && !next.includes(normalized)) {
          next.push(normalized);
        }
      });
      return next;
    });
  };

  const handleSafeFoodInputChange = (value: string) => {
    const hasWhitespace = /\s/.test(value);
    if (!hasWhitespace) {
      setSafeFoodInput(value);
      return;
    }

    const trailingWhitespace = /\s$/.test(value);
    const parts = value.split(/\s+/);
    const completed = trailingWhitespace ? parts : parts.slice(0, -1);
    const remainder = trailingWhitespace ? "" : (parts[parts.length - 1] || "");

    addSafeFoodTags(completed.filter(Boolean));
    setSafeFoodInput(remainder);
  };

  const handleSafeFoodKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = safeFoodInput.trim();
      if (trimmed) {
        addSafeFoodTags([trimmed]);
        setSafeFoodInput("");
      }
    }
  };

  const removeSafeFoodTag = (tagToRemove: string) => {
    setSafeFoodTagsDraft(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSaveLanguages = () => {
    const languageString = selectedLanguages.join(", ");
    setProfile({ spokenLanguages: languageString });
    setSections(sections.map(s =>
      s.id === "languages" ? { ...s, content: languageString } : s
    ));
    setShowLanguageSelector(false);
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleSaveAll = () => {
    // Save sections to profile/storage
    setProfile({
      spokenLanguages: sections.find(s => s.id === "languages")?.content || "English",
      cardSections: sections, // Store in profile
    });
    nav(-1);
  };

  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 border-b border-[#dbcdbd]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[24px] text-[#100d09]" style={{ fontWeight: 600 }}>
            Edit My Card
          </h1>
          <button onClick={() => nav(-1)}>
            <X size={20} />
          </button>
        </div>
        <p className="text-[13px] text-[#846848]">
          Customize which sections appear on your allergy card and how they're displayed
        </p>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="mt-3 w-full py-2 bg-[#fcf5e9] text-[#525a3f] rounded-lg text-[14px] flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[70vh] flex flex-col">
            <div className="px-4 pt-6 pb-4 border-b border-[#dbcdbd]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[20px] text-[#100d09]" style={{ fontWeight: 600 }}>
                  Languages I Speak
                </h2>
                <button onClick={() => setShowLanguageSelector(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-[13px] text-[#846848]">
                Select all languages you can communicate in
              </p>
            </div>

            <div className="flex-1 overflow-auto px-4 py-4">
              <div className="space-y-2">
                {availableLanguages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                      selectedLanguages.includes(lang)
                        ? "bg-[#e7eae1] border-[#525a3f]"
                        : "bg-white border-[#dbcdbd]"
                    }`}
                  >
                    <span className="text-[15px] text-[#100d09]">{lang}</span>
                    {selectedLanguages.includes(lang) && (
                      <div className="w-5 h-5 rounded-full bg-[#525a3f] flex items-center justify-center">
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-6 pt-4 border-t border-[#dbcdbd]">
              <button
                onClick={handleSaveLanguages}
                disabled={selectedLanguages.length === 0}
                className="w-full py-3 bg-[#525a3f] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Languages ({selectedLanguages.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl max-h-[85vh] flex flex-col">
            <div className="px-4 pt-6 pb-4 border-b border-[#dbcdbd]">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] text-[#100d09]" style={{ fontWeight: 600 }}>
                  Card Preview
                </h2>
                <button onClick={() => setShowPreview(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-[13px] text-[#846848] mt-1">
                This is how your card will appear
              </p>
            </div>

            <div className="flex-1 overflow-auto px-4 py-4">
              <div className="space-y-4">
                {sections.filter(s => s.isVisible).map(section => (
                  <div key={section.id}>
                    {section.id === "primary" ? (
                      <div className="bg-[#fcf5e9] rounded-lg p-4">
                        <p
                          className="text-[#100d09] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px`, fontWeight: section.isBold ? 600 : 400 }}
                        >
                          🔴 {section.content}
                        </p>
                      </div>
                    ) : section.id === "cross-contamination" ? (
                      <div className="bg-[#fcf5e9] rounded-lg p-4">
                        <p
                          className="text-[#100d09] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px`, fontWeight: section.isBold ? 600 : 400 }}
                        >
                          🔴 {section.content}
                        </p>
                      </div>
                    ) : section.id === "safe-foods" ? (
                      <div>
                        <hr className="border-[#dbcdbd] mb-4" />
                        <div className="bg-[#fcf5e9] rounded-lg p-4">
                          <ul className="flex flex-wrap gap-2">
                            {parseSafeFoodTags(section.content).map(tag => (
                              <li
                                key={tag}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#dbcdbd] text-[#100d09]"
                                style={{ fontSize: `${section.fontSize}px`, fontWeight: section.isBold ? 600 : 400 }}
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : section.id === "languages" ? (
                      <div className="bg-[#fcf5e9] rounded-lg p-4">
                        <p
                          className="text-[#100d09] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px`, fontWeight: section.isBold ? 600 : 400 }}
                        >
                          <span style={{ fontWeight: 600 }}>Languages I speak:</span> {section.content}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#fcf5e9] rounded-lg p-4">
                        <p
                          className="text-[#100d09] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px`, fontWeight: section.isBold ? 600 : 400 }}
                        >
                          {section.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pb-6 pt-4 border-t border-[#dbcdbd]">
              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-3 bg-[#525a3f] text-white rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="space-y-4">
          {sections.map(section => (
            <div
              key={section.id}
              className={`border rounded-lg ${
                section.isVisible ? "border-[#dbcdbd] bg-white" : "border-[#c9b49c] bg-[#fcf5e9]"
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#dbcdbd]">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[14px] text-[#423424]" style={{ fontWeight: 600 }}>
                    {section.label}
                  </span>
                  {!section.isVisible && (
                    <span className="text-[12px] text-[#846848] bg-[#dbcdbd] px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisibility(section.id)}
                    className="p-1.5 hover:bg-[#FCF5E8] rounded"
                  >
                    {section.isVisible ? (
                      <Eye size={16} className="text-[#423424]" />
                    ) : (
                      <EyeOff size={16} className="text-[#a4825b]" />
                    )}
                  </button>
                  {section.id !== "languages" && section.id !== "primary" && (
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 hover:bg-[#FCF5E8] rounded"
                    >
                      <Trash2 size={16} className="text-[#DA1E28]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Section Content */}
              <div className="p-4">
                {/* Special handling for Languages section */}
                {section.id === "languages" ? (
                  <div>
                    <p className="text-[16px] text-[#100d09] mb-3">
                      {section.content}
                    </p>
                    <button
                      onClick={() => setShowLanguageSelector(true)}
                      className="flex items-center gap-1.5 text-[14px] text-[#525a3f]"
                    >
                      <Edit2 size={14} /> Edit languages
                    </button>
                  </div>
                ) : editingSection === section.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    {section.id === "safe-foods" ? (
                      <div className="space-y-2">
                        <ul className="flex flex-wrap gap-2">
                          {safeFoodTagsDraft.map(tag => (
                            <li
                              key={tag}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fcf5e9] border border-[#dbcdbd] text-[14px] text-[#100d09]"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeSafeFoodTag(tag)}
                                className="text-[#846848] hover:text-[#423424]"
                                aria-label={`Remove ${tag}`}
                              >
                                x
                              </button>
                            </li>
                          ))}
                        </ul>
                        <input
                          value={safeFoodInput}
                          onChange={(e) => handleSafeFoodInputChange(e.target.value)}
                          onKeyDown={handleSafeFoodKeyDown}
                          className="w-full p-3 border border-[#dbcdbd] rounded-lg text-[16px] text-[#100d09]"
                          placeholder="Type ingredient then space..."
                        />
                      </div>
                    ) : (
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full min-h-[120px] p-3 border border-[#dbcdbd] rounded-lg text-[16px] text-[#100d09] resize-y"
                        placeholder="Enter content..."
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(section.id)}
                        className="flex-1 py-2 bg-[#525a3f] text-white rounded-lg text-[14px]"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 py-2 border border-[#dbcdbd] text-[#100d09] rounded-lg text-[14px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="space-y-3">
                    {section.id === "safe-foods" ? (
                      <ul className="flex flex-wrap gap-2">
                        {parseSafeFoodTags(section.content).map(tag => (
                          <li
                            key={tag}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fcf5e9] border border-[#dbcdbd] text-[#100d09]"
                            style={{ fontWeight: section.isBold ? 600 : 400 }}
                          >
                            <span>{tag}</span>
                            <span className="text-[#846848]">x</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        className="text-[#100d09] leading-relaxed"
                        style={{ fontSize: `${section.fontSize}px`, fontWeight: section.isBold ? 600 : 400 }}
                      >
                        {section.content}
                      </p>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      {/* Text Style Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBold(section.id)}
                          className={`w-8 h-8 flex items-center justify-center border rounded hover:bg-[#FCF5E8] ${
                            section.isBold ? "border-[#525a3f] text-[#525a3f] bg-[#e7eae1]" : "border-[#dbcdbd] text-[#100d09]"
                          }`}
                          aria-label="Toggle bold text"
                        >
                          <Bold size={14} />
                        </button>
                      </div>

                      {section.isEditable && (
                        <button
                          onClick={() => handleEditSection(section.id, section.content)}
                          className="ml-auto flex items-center gap-1.5 text-[14px] text-[#525a3f]"
                        >
                          <Edit2 size={14} /> Edit text
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add Custom Section Button */}
          <button
            onClick={handleAddCustomSection}
            className="w-full py-4 border-2 border-dashed border-[#c9b49c] rounded-lg flex items-center justify-center gap-2 text-[#423424] hover:border-[#525a3f] hover:text-[#525a3f] transition-colors"
          >
            <Plus size={18} />
            <span className="text-[15px]">Add custom section</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 pb-6 pt-4 border-t border-[#dbcdbd]">
        <button
          onClick={handleSaveAll}
          className="w-full py-3 bg-[#525a3f] text-white rounded-lg"
        >
          Save Card Settings
        </button>
      </div>
    </div>
  );
}

function parseSafeFoodTags(content: string): string[] {
  return content
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

// Helper function to generate cross-contamination text based on profile
function getCrossContaminationText(level: number): string {
  switch (level) {
    case 0: // Very strict
      return "I have SEVERE reactions to gluten. Even trace amounts from shared surfaces, utensils, or airborne flour can make me extremely ill. I need dedicated gluten-free preparation area, separate cookware, and fresh gloves.";
    case 1: // Strict
      return "Cross-contact is dangerous for me. Please use clean surfaces, separate utensils, fresh gloves, and avoid shared fryers or cutting boards. Even crumbs can trigger severe symptoms.";
    case 2: // Moderate
      return "Please take care to avoid cross-contact. Use clean utensils and surfaces when preparing my food. Shared fryers should be avoided.";
    case 3: // Flexible
      return "I prefer to avoid cross-contact when possible. Please wipe down surfaces and use clean utensils if convenient.";
    case 4: // Very flexible
      return "Minor cross-contact is okay for me, but I still cannot eat foods with gluten as a direct ingredient.";
    default:
      return "Cross-contamination is dangerous for me. Please use clean surfaces and utensils.";
  }
}
