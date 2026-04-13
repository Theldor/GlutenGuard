import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X, Plus, Trash2, Edit2, Type, Eye, EyeOff } from "lucide-react";
import { useApp } from "../store";

interface CardSection {
  id: string;
  label: string;
  content: string;
  fontSize: number;
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
      isVisible: true,
      isEditable: false,
    },
    {
      id: "primary",
      label: "Primary restriction",
      content: "I have celiac disease. I cannot eat anything containing wheat, barley, rye, or oats.",
      fontSize: 20,
      isVisible: true,
      isEditable: true,
    },
    {
      id: "cross-contamination",
      label: "Cross-contamination warning",
      content: getCrossContaminationText(profile.crossContamination),
      fontSize: 18,
      isVisible: true,
      isEditable: true,
    },
    {
      id: "safe-foods",
      label: "Safe ingredients I CAN eat",
      content: "Rice, corn, potatoes, vegetables, fruit, meat, fish, eggs, dairy, beans",
      fontSize: 18,
      isVisible: true,
      isEditable: true,
    },
  ]);

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
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
  };

  const handleSaveEdit = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, content: editingContent } : s
    ));
    setEditingSection(null);
    setEditingContent("");
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditingContent("");
  };

  const handleFontSizeChange = (id: string, change: number) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, fontSize: Math.max(12, Math.min(28, s.fontSize + change)) } : s
    ));
  };

  const handleToggleVisibility = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
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
      isVisible: true,
      isEditable: true,
    };
    setSections([...sections, newSection]);
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
      <div className="px-4 pt-10 pb-4 border-b border-[#e0e0e0]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[24px] text-[#161616]" style={{ fontWeight: 600 }}>
            Edit My Card
          </h1>
          <button onClick={() => nav(-1)}>
            <X size={20} />
          </button>
        </div>
        <p className="text-[13px] text-[#6f6f6f]">
          Customize which sections appear on your allergy card and how they're displayed
        </p>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="mt-3 w-full py-2 bg-[#F4F4F4] text-[#0F62FE] rounded-lg text-[14px] flex items-center justify-center gap-2"
        >
          <Eye size={16} />
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
      </div>

      {/* Language Selector Modal */}
      {showLanguageSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[70vh] flex flex-col">
            <div className="px-4 pt-6 pb-4 border-b border-[#e0e0e0]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[20px] text-[#161616]" style={{ fontWeight: 600 }}>
                  Languages I Speak
                </h2>
                <button onClick={() => setShowLanguageSelector(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-[13px] text-[#6f6f6f]">
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
                        ? "bg-[#E0E0FF] border-[#0F62FE]"
                        : "bg-white border-[#e0e0e0]"
                    }`}
                  >
                    <span className="text-[15px] text-[#161616]">{lang}</span>
                    {selectedLanguages.includes(lang) && (
                      <div className="w-5 h-5 rounded-full bg-[#0F62FE] flex items-center justify-center">
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-6 pt-4 border-t border-[#e0e0e0]">
              <button
                onClick={handleSaveLanguages}
                disabled={selectedLanguages.length === 0}
                className="w-full py-3 bg-[#0F62FE] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="px-4 pt-6 pb-4 border-b border-[#e0e0e0]">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] text-[#161616]" style={{ fontWeight: 600 }}>
                  Card Preview
                </h2>
                <button onClick={() => setShowPreview(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-[13px] text-[#6f6f6f] mt-1">
                This is how your card will appear
              </p>
            </div>

            <div className="flex-1 overflow-auto px-4 py-4">
              <div className="space-y-4">
                {sections.filter(s => s.isVisible).map(section => (
                  <div key={section.id}>
                    {section.id === "primary" ? (
                      <div className="bg-[#F4F4F4] rounded-lg p-4">
                        <p
                          className="text-[#161616] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px` }}
                        >
                          🔴 {section.content}
                        </p>
                      </div>
                    ) : section.id === "cross-contamination" ? (
                      <div className="bg-[#F4F4F4] rounded-lg p-4">
                        <p
                          className="text-[#161616] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px`, fontWeight: 600 }}
                        >
                          🔴 {section.content}
                        </p>
                      </div>
                    ) : section.id === "safe-foods" ? (
                      <div>
                        <hr className="border-[#e0e0e0] mb-4" />
                        <div className="bg-[#F4F4F4] rounded-lg p-4">
                          <p
                            className="text-[#161616] leading-relaxed"
                            style={{ fontSize: `${section.fontSize}px`, fontWeight: 600 }}
                          >
                            🟢 {section.content}
                          </p>
                        </div>
                      </div>
                    ) : section.id === "languages" ? (
                      <div className="bg-[#F4F4F4] rounded-lg p-4">
                        <p
                          className="text-[#161616] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px` }}
                        >
                          <span style={{ fontWeight: 600 }}>Languages I speak:</span> {section.content}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-[#F4F4F4] rounded-lg p-4">
                        <p
                          className="text-[#161616] leading-relaxed"
                          style={{ fontSize: `${section.fontSize}px` }}
                        >
                          {section.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pb-6 pt-4 border-t border-[#e0e0e0]">
              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-3 bg-[#0F62FE] text-white rounded-lg"
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
                section.isVisible ? "border-[#e0e0e0] bg-white" : "border-[#c6c6c6] bg-[#f4f4f4]"
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[14px] text-[#525252]" style={{ fontWeight: 600 }}>
                    {section.label}
                  </span>
                  {!section.isVisible && (
                    <span className="text-[12px] text-[#6f6f6f] bg-[#e0e0e0] px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisibility(section.id)}
                    className="p-1.5 hover:bg-[#f4f4f4] rounded"
                  >
                    {section.isVisible ? (
                      <Eye size={16} className="text-[#525252]" />
                    ) : (
                      <EyeOff size={16} className="text-[#8d8d8d]" />
                    )}
                  </button>
                  {section.id !== "languages" && section.id !== "primary" && (
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 hover:bg-[#f4f4f4] rounded"
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
                    <p className="text-[16px] text-[#161616] mb-3">
                      {section.content}
                    </p>
                    <button
                      onClick={() => setShowLanguageSelector(true)}
                      className="flex items-center gap-1.5 text-[14px] text-[#0F62FE]"
                    >
                      <Edit2 size={14} /> Edit languages
                    </button>
                  </div>
                ) : editingSection === section.id ? (
                  /* Edit Mode */
                  <div className="space-y-3">
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full min-h-[120px] p-3 border border-[#e0e0e0] rounded-lg text-[16px] text-[#161616] resize-y"
                      placeholder="Enter content..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(section.id)}
                        className="flex-1 py-2 bg-[#0F62FE] text-white rounded-lg text-[14px]"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 py-2 border border-[#e0e0e0] text-[#161616] rounded-lg text-[14px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="space-y-3">
                    <p
                      className="text-[#161616] leading-relaxed"
                      style={{ fontSize: `${section.fontSize}px` }}
                    >
                      {section.content}
                    </p>

                    <div className="flex items-center gap-3 pt-2">
                      {/* Font Size Controls */}
                      <div className="flex items-center gap-2">
                        <Type size={14} className="text-[#525252]" />
                        <button
                          onClick={() => handleFontSizeChange(section.id, -2)}
                          className="w-7 h-7 flex items-center justify-center border border-[#e0e0e0] rounded text-[#161616] hover:bg-[#f4f4f4]"
                        >
                          −
                        </button>
                        <span className="text-[13px] text-[#525252] w-8 text-center">
                          {section.fontSize}
                        </span>
                        <button
                          onClick={() => handleFontSizeChange(section.id, 2)}
                          className="w-7 h-7 flex items-center justify-center border border-[#e0e0e0] rounded text-[#161616] hover:bg-[#f4f4f4]"
                        >
                          +
                        </button>
                      </div>

                      {section.isEditable && (
                        <button
                          onClick={() => handleEditSection(section.id, section.content)}
                          className="ml-auto flex items-center gap-1.5 text-[14px] text-[#0F62FE]"
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
            className="w-full py-4 border-2 border-dashed border-[#c6c6c6] rounded-lg flex items-center justify-center gap-2 text-[#525252] hover:border-[#0F62FE] hover:text-[#0F62FE] transition-colors"
          >
            <Plus size={18} />
            <span className="text-[15px]">Add custom section</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="px-4 pb-6 pt-4 border-t border-[#e0e0e0]">
        <button
          onClick={handleSaveAll}
          className="w-full py-3 bg-[#0F62FE] text-white rounded-lg"
        >
          Save Card Settings
        </button>
      </div>
    </div>
  );
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
