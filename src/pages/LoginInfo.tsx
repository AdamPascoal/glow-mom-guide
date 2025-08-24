import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type StageOption = {
  key: string;
  title: string;
  description: string;
};

const STAGE_OPTIONS: StageOption[] = [
  {
    key: "trying",
    title: "Trying to Conceive",
    description: "Planning and preparing for pregnancy.",
  },
  {
    key: "incubator",
    title: "Incubator Stage",
    description: "Currently pregnant and nurturing your bump.",
  },
  {
    key: "veteran",
    title: "Veteran Stage",
    description: "Experienced and guiding through postpartum or beyond.",
  },
];

export default function LoginInfo() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelect = (key: string, title: string) => {
    try {
      localStorage.setItem("pregnancy_stage", key);
      toast({ title: "Saved", description: `${title} selected` });
      navigate("/profile");
    } catch (error) {
      toast({ title: "Unable to save", description: "Please try again." });
    }
  };

  const options = useMemo(() => STAGE_OPTIONS, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 animate-in slide-in-from-top-4 fade-in duration-500">
          <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-wellness bg-clip-text text-transparent">
            Tell us where you are on your journey
          </h2>
          <p className="text-muted-foreground mt-2">
            Choose one option below. You can change this later in Profile.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {options.map((option, index) => (
            <Card
              key={option.key}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] data-[state=open]:animate-in data-[state=closed]:animate-out",
                "animate-in fade-in duration-500",
                index === 0 && "delay-100",
                index === 1 && "delay-200",
                index === 2 && "delay-300"
              )}
              onClick={() => handleSelect(option.key, option.title)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                <Button className="mt-4 w-full" variant="secondary">
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

