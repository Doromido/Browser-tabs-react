import App from "../App";


function Tabs() {
  const baseTabs = [
    { label: "Dashboard", url: "/dashboard", content: {} },
    { label: "Banking", url: "/banking", content: {} },
    { label: "Telefonie",url: "/telefonie", content: {} },
    { label: "Accounting",url: "/accounting", content: {} },
    { label: "Verkauf",url: "/verkauf", content: {} },
    { label: "Statistik",url: "/statistik", content: {} },
    { label: "Post Office",url: "/post-office", content: {} },
    { label: "Administration",url: "/administration", content: {} },
    { label: "Help",url: "/help", content: {} },
    { label: "Warenbestand",url: "/warenbestand", content: {} },
    { label: "Auswahllisten",url: "/auswahllisten", content: {} },
    { label: "Einkauf",url: "/einkauf", content: {} },
    { label: "Rechn",url: "/rechn", content: {} },
    { label: "Lagerverwaitung",url: "/lagerverwaitung", content: {} },];

  const tabsWithPinned = baseTabs.map((tab) => ({ ...tab, pinned: false }));

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <App tabs={tabsWithPinned} />
    </div>
  );
}

export default Tabs;
