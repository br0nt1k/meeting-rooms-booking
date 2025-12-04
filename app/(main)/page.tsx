import Link from "next/link";
import { Button } from "@/components/ui/Button"; 

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Бронювання кімнат</h1>
          <p className="text-gray-500 mt-1">Оберіть кімнату для вашої зустрічі</p>
        </div>
        
        <Link href="/rooms/new">
          <Button>+ Додати кімнату</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center h-48 text-gray-400">
          <p>Список кімнат поки порожній...</p>
        </div>
      </div>
    </div>
  );
}