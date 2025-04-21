import App from "../App";


function Tabs() {
  const baseTabs = [
    { label: "Dashboard", content: {} },
    { label: "Banking", content: {} },
    { label: "Telefonie", content: {} },
    { label: "Accounting", content: {} },
    { label: "Verkauf", content: {} },
    { label: "Statistik", content: {} },
    { label: "Post Office", content: {} },
    { label: "Administration", content: {} },
    { label: "Help", content: {} },
    { label: "Warenbestand", content: {} },
    { label: "Auswahllisten", content: {} },
    { label: "Einkauf", content: {} },
    { label: "Rechn", content: {} },
    { label: "Lagerverwaitung", content: {} },];

  const tabsWithPinned = baseTabs.map((tab) => ({ ...tab, pinned: false }));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <App tabs={tabsWithPinned} />
    </div>
  );
}

export default Tabs;
