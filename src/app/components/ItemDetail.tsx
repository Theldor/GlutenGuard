import { useNavigate } from "react-router";
import { ArrowLeft, Share2 } from "lucide-react";

export function ItemDetail() {
  const nav = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-4 pb-3 border-b border-[#dbcdbd] flex items-center gap-3">
        <button onClick={() => nav(-1)}><ArrowLeft size={20} /></button>
        <h3 className="text-[#100d09]">Item Detail</h3>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#100d09]">Risotto ai Funghi</h2>
          <span className="px-2 py-0.5 rounded text-[12px] bg-[#e7eae1] text-[#6d7854]">Low Risk</span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-[13px] text-[#423424]">High confidence</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i < 4 ? "bg-[#6d7854]" : "bg-[#dbcdbd]"}`} />
            ))}
          </div>
        </div>

        <Section title="Ingredients">
          <p className="text-[14px] text-[#423424]">
            Arborio rice, mushroom, parmesan, butter, white wine,{" "}
            <span className="bg-[#fef4cd] px-1 rounded">vegetable broth</span>
          </p>
        </Section>

        <Section title="Cross-contamination notes">
          <p className="text-[14px] text-[#423424]">
            Risotto is typically prepared in its own pot. Main risk is the broth — some restaurants
            use broth containing gluten.
          </p>
        </Section>

        <Section title="Questions to ask">
          <ol className="list-decimal list-inside text-[14px] text-[#423424] space-y-1">
            <li>Is your vegetable broth gluten-free or homemade?</li>
            <li>Is the risotto prepared in a dedicated pot?</li>
          </ol>
        </Section>

        <Section title="Substitutions">
          <p className="text-[14px] text-[#423424]">
            If broth contains gluten, ask for olive oil and water-based preparation.
          </p>
        </Section>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#dbcdbd]">
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#100d09]">Add to my order</span>
            <div className="w-10 h-5 rounded-full bg-[#525a3f] relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
          <button className="w-9 h-9 rounded-full bg-[#fcf5e9] flex items-center justify-center">
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[#100d09] text-[14px] mb-2" style={{ fontWeight: 600 }}>{title}</p>
      {children}
    </div>
  );
}
