import MortgageCalculatorWithChart from '../src/components/mortgage/MortgageCalculatorWithChart';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Mortgage Calculator</h1>
      <MortgageCalculatorWithChart />
    </main>
  );
}