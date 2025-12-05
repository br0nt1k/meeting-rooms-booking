import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      
      <div className="relative -top-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Упс! Сторінку не знайдено
        </h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Здається, ви заблукали. Сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Link href="/">
          <Button variant="dark" className="px-8">
            Повернутися на головну
          </Button>
        </Link>
      </div>
    </div>
  );
}
