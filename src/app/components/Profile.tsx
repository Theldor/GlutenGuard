import { useApp } from "../store";
import { BottomTabs } from "./BottomTabs";
import { CreditCard, Settings, HelpCircle, LogOut, CheckCircle, AlertCircle, Edit2, X, Plus, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

const severityLabels = ["Very sensitive", "Moderate", "Mild", "By choice"];

export function Profile() {
  const { profile } = useApp();
  const nav = useNavigate();
  const sev = Math.max(0, profile.sensitivity);
  const [customIngredients, setCustomIngredients] = useState(["Oats (even GF)", "Corn"]);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [showBlockList, setShowBlockList] = useState(false);

  const restrictions = [
    { name: "Dairy", selected: true },
    { name: "Soy", selected: true },
    { name: "Nightshades", selected: true },
    { name: "Tree Nuts", selected: true },
  ];

  const removeCustomIngredient = (index: number) => {
    setCustomIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const addCustomIngredient = () => {
    // In a real app, this would show a modal or input field
    const ingredient = prompt("Enter ingredient to block:");
    if (ingredient) {
      setCustomIngredients(prev => [...prev, ingredient]);
    }
  };

  const menuItems = [
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: LogOut, label: "Sign Out", action: () => {} },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-auto px-4 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#0F62FE] flex items-center justify-center text-white text-[24px]">
            {profile.name[0]}
          </div>
          <div>
            <h2 className="text-[#161616]">{profile.name}</h2>
            <p className="text-[13px] text-[#6f6f6f]">Sensitivity: {severityLabels[sev]}</p>
          </div>
        </div>

        {/* Prominent Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            onClick={() => nav("/allergy-card")}
            className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl border-2 border-[#0F62FE] bg-[#EDF5FF] text-left hover:bg-[#D0E2FF]"
          >
            <CreditCard size={24} className="text-[#0F62FE]" />
            <span className="text-[#0F62FE] text-[15px]" style={{ fontWeight: 600 }}>Allergy Card</span>
          </button>
          <button
            onClick={() => {}}
            className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-2xl border-2 border-[#e0e0e0] bg-white text-left hover:bg-[#F9F9F9]"
          >
            <Settings size={24} className="text-[#525252]" />
            <span className="text-[#161616] text-[15px]" style={{ fontWeight: 600 }}>Settings</span>
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {/* My Restrictions Dropdown */}
          <div className="border border-[#e0e0e0] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowRestrictions(!showRestrictions)}
              className="w-full flex items-center justify-between px-4 py-4 text-left bg-white hover:bg-[#F9F9F9]"
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-[#525252]" />
                <span className="text-[#161616] text-[15px]" style={{ fontWeight: 500 }}>My Restrictions</span>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-[#525252] transition-transform ${showRestrictions ? 'rotate-180' : ''}`}
              />
            </button>
            
            {showRestrictions && (
              <div className="px-4 pb-4 border-t border-[#e0e0e0]">
                {/* Celiac Disease - Primary condition */}
                <div className="bg-[#F4F4F4] border border-[#e0e0e0] rounded-2xl p-4 mb-3 mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-[#198038]" />
                      <span className="text-[#161616] text-[16px]" style={{ fontWeight: 600 }}>Celiac Disease</span>
                    </div>
                    <div className="bg-[#DA1E28] text-white px-3 py-1 rounded-full text-[12px] flex items-center gap-1" style={{ fontWeight: 500 }}>
                      <AlertCircle size={14} />
                      High Risk
                    </div>
                  </div>
                  <p className="text-[13px] text-[#6f6f6f] ml-7">Primary condition (locked)</p>
                </div>

                {/* Other restrictions */}
                <div className="space-y-2">
                  {restrictions.map((restriction) => (
                    <div
                      key={restriction.name}
                      className="bg-white border border-[#e0e0e0] rounded-2xl px-4 py-4"
                    >
                      <span className="text-[#161616] text-[15px]">{restriction.name}</span>
                    </div>
                  ))}
                </div>

                {/* Reaction severity */}
                <div className="bg-[#FAF4ED] border border-[#e0e0e0] rounded-2xl p-4 mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#161616] text-[15px]" style={{ fontWeight: 600 }}>Reaction severity</p>
                      <p className="text-[13px] text-[#8d8175] mt-0.5">Moderate reaction</p>
                    </div>
                    <button className="p-2">
                      <Edit2 size={18} className="text-[#525252]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Ingredient Block List Dropdown */}
          <div className="border border-[#e0e0e0] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowBlockList(!showBlockList)}
              className="w-full flex items-center justify-between px-4 py-4 text-left bg-white hover:bg-[#F9F9F9]"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <div className="w-3 h-0.5 bg-[#525252]" />
                  <div className="w-3 h-0.5 bg-[#525252]" />
                  <div className="w-3 h-0.5 bg-[#525252]" />
                </div>
                <span className="text-[#161616] text-[15px]" style={{ fontWeight: 500 }}>Custom Ingredient Block List</span>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-[#525252] transition-transform ${showBlockList ? 'rotate-180' : ''}`}
              />
            </button>

            {showBlockList && (
              <div className="px-4 pb-4 border-t border-[#e0e0e0]">
                <p className="text-[13px] text-[#8d8175] mb-4 mt-3 leading-relaxed">
                  Ingredients flagged regardless of general risk model. We'll warn you about these in addition to standard celiac restrictions.
                </p>

                <div className="space-y-2">
                  {customIngredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="bg-white border border-[#e0e0e0] rounded-2xl px-4 py-3.5 flex items-center justify-between"
                    >
                      <span className="text-[#161616] text-[15px]">{ingredient}</span>
                      <button
                        onClick={() => removeCustomIngredient(index)}
                        className="p-1"
                      >
                        <X size={18} className="text-[#525252]" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addCustomIngredient}
                  className="w-full mt-3 border border-[#e0e0e0] rounded-2xl px-4 py-3.5 flex items-center justify-center gap-2 text-[#161616] text-[15px]"
                >
                  <Plus size={18} />
                  Add ingredient
                </button>
              </div>
            )}
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full flex items-center justify-between px-4 py-4 rounded-2xl border border-[#e0e0e0] text-left bg-white hover:bg-[#F9F9F9]"
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className="text-[#525252]" />
                <span className="text-[#161616] text-[15px]" style={{ fontWeight: 500 }}>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <BottomTabs />
    </div>
  );
}