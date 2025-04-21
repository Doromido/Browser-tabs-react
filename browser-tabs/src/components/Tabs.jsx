import App from "../App";

function Tabs() {
  const tabs = [
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
    { label: "Lagerverwaitung", content: {} },
   
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <App tabs={tabs} />
    </div>
  );
}

export default Tabs;
