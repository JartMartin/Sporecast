{
  // Add import for CommodityExplorer
  const content = `import { CommodityExplorer } from "./components/commodity-explorer";`;
  // Add CommodityExplorer component after the time horizon tabs section
  const section = `
          {/* Commodity Explorer Section */}
          <div className="mt-12">
            <CommodityExplorer
              selectedCommodity={{
                name: "Milling Wheat / Blé de Meunerie",
                marketCode: "MWT",
                currentPrice: 201.48,
                volume: {
                  amount: 46.53,
                  unit: "K",
                  change: 8
                }
              }}
            />
          </div>`;
}