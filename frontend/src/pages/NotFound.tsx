import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-6 px-6">

        <p className="text-8xl font-bold text-gray-100">404</p>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
          <p className="text-muted-foreground text-sm">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button className="bg-black text-white hover:bg-black" onClick={() => navigate("/")}>
            Go home
          </Button>
        </div>

      </div>
    </div>
  )
}