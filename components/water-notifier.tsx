// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Slider } from "@/components/ui/slider";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Bell, Volume2 } from "lucide-react";
// import WaterLevel from "./water-level";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// export default function WaterNotifier() {
//   const [intervalMinutes, setIntervalMinutes] = useState(60);
//   const [customMessage, setCustomMessage] = useState("Time to drink water!");
//   const [isActive, setIsActive] = useState(false);
//   const [glassesCount, setGlassesCount] = useState(0);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [nextReminderTime, setNextReminderTime] = useState<number | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState("--:--");
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const timerRef = useRef<number | null>(null);
//   const [isClient, setIsClient] = useState(false);
//   const [notificationPermission, setNotificationPermission] = useState<
//     NotificationPermission | "default"
//   >("default");

//   useEffect(() => {
//     // Ensure this only runs on the client
//     setIsClient(true);

//     // Check notification permission on client side
//     if (typeof window !== "undefined" && "Notification" in window) {
//       setNotificationPermission(Notification.permission);
//     }

//     // Create audio element only on client side
//     audioRef.current = new Audio("/notification.mp3");

//     return () => {
//       if (timerRef.current) cancelAnimationFrame(timerRef.current);
//     };
//   }, []);

//   const updateTimeDisplay = (target: number) => {
//     if (!isClient) return;

//     const now = Date.now();
//     const diff = Math.max(0, target - now);
//     const minutes = Math.floor(diff / 60000);
//     const seconds = Math.floor((diff % 60000) / 1000);
//     setTimeRemaining(
//       `${minutes.toString().padStart(2, "0")}:${seconds
//         .toString()
//         .padStart(2, "0")}`
//     );
//     return diff;
//   };

//   const startTimer = () => {
//     if (!isClient) return;

//     // Clear any existing timer
//     if (timerRef.current) cancelAnimationFrame(timerRef.current);

//     // Set initial time immediately
//     const now = Date.now();
//     const next = now + intervalMinutes * 60000;
//     setNextReminderTime(next);
//     updateTimeDisplay(next);

//     // Use requestAnimationFrame for more precise timing
//     const updateTimer = () => {
//       const now = Date.now();
//       const diff = updateTimeDisplay(next);

//       if (diff !== undefined && diff <= 0) {
//         playNotification();
//         const newNext = now + intervalMinutes * 60000;
//         setNextReminderTime(newNext);
//         updateTimeDisplay(newNext);
//       } else {
//         // Continue the timer
//         timerRef.current = requestAnimationFrame(updateTimer);
//       }
//     };

//     // Start the initial animation frame
//     timerRef.current = requestAnimationFrame(updateTimer);
//   };

//   useEffect(() => {
//     if (!isClient) return;

//     if (isActive) {
//       startTimer();
//     } else {
//       if (timerRef.current) {
//         cancelAnimationFrame(timerRef.current);
//         timerRef.current = null;
//       }
//       setTimeRemaining("--:--");
//       setNextReminderTime(null);
//     }

//     return () => {
//       if (timerRef.current) cancelAnimationFrame(timerRef.current);
//     };
//   }, [isActive, intervalMinutes, isClient]);

//   const playNotification = () => {
//     if (!isClient) return;

//     if (audioRef.current) {
//       audioRef.current.play();
//       if ("Notification" in window && Notification.permission === "granted") {
//         new Notification(customMessage);
//       }
//     }
//   };

//   const requestNotificationPermission = async () => {
//     if (!isClient) return;

//     if ("Notification" in window) {
//       try {
//         const permission = await Notification.requestPermission();
//         setNotificationPermission(permission);
//       } catch (error) {
//         console.error("Error requesting notification permission:", error);
//       }
//     }
//   };

//   const toggleTimer = () => {
//     setIsActive(!isActive);
//   };

//   const drinkWater = () => {
//     if (glassesCount < 8) {
//       setGlassesCount(glassesCount + 1);
//     } else {
//       setGlassesCount(9);
//       setIsCompleted(true);
//       setIsActive(false);
//     }
//   };

//   const resetApp = () => {
//     setGlassesCount(0);
//     setIsCompleted(false);
//     setIsActive(false);
//     setTimeRemaining("--:--");
//   };

//   // Render a placeholder or nothing during server-side rendering
//   if (!isClient) {
//     return (
//       <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4">
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4">
//       <Dialog open={isCompleted} onOpenChange={setIsCompleted}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="text-base sm:text-lg">
//               Hydration Goal Achieved! 🎉
//             </DialogTitle>
//           </DialogHeader>
//           <div className="text-xs sm:text-sm text-muted-foreground">
//             You've successfully completed your daily water intake. Well done!
//           </div>
//           <Button
//             onClick={resetApp}
//             className="mt-2 sm:mt-4 text-xs sm:text-sm"
//           >
//             Start New Cycle
//           </Button>
//         </DialogContent>
//       </Dialog>

//       <Card className="col-span-1 md:col-span-2">
//         <CardHeader className="pb-2 sm:pb-4">
//           <CardTitle className="text-base sm:text-xl">
//             Reminder Configuration
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3 sm:space-y-6">
//           <div className="space-y-1 sm:space-y-2">
//             <div className="flex justify-between pb-1 sm:pb-2">
//               <Label htmlFor="interval" className="text-xs sm:text-sm">
//                 Reminder Interval: {intervalMinutes} minutes
//               </Label>
//             </div>
//             <Slider
//               id="interval"
//               min={1}
//               max={120}
//               step={1}
//               value={[intervalMinutes]}
//               onValueChange={(value) => setIntervalMinutes(value[0])}
//               disabled={isActive}
//               className="h-2 sm:h-4"
//             />
//           </div>

//           <div className="space-y-1 sm:space-y-2">
//             <Label htmlFor="message" className="text-xs sm:text-sm">
//               Custom Message
//             </Label>
//             <Input
//               id="message"
//               value={customMessage}
//               onChange={(e) => setCustomMessage(e.target.value)}
//               disabled={isActive}
//               className="text-xs sm:text-sm h-8 sm:h-10"
//             />
//           </div>

//           <div className="flex flex-col space-y-2">
//             <div className="grid grid-cols-3 gap-1 sm:gap-2">
//               <Button
//                 onClick={toggleTimer}
//                 className="h-8 sm:h-12 text-xs sm:text-sm"
//                 variant={isActive ? "destructive" : "default"}
//               >
//                 {isActive ? "Stop Timer" : "Start Timer"}
//               </Button>
//               <Button
//                 onClick={requestNotificationPermission}
//                 variant="outline"
//                 className="h-8 sm:h-12 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
//               >
//                 <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
//                 Notifications
//               </Button>
//               <Button
//                 onClick={playNotification}
//                 variant="outline"
//                 className="h-8 sm:h-12 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
//               >
//                 <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
//                 Test Sound
//               </Button>
//             </div>
//           </div>

//           {isActive && (
//             <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-muted rounded-lg">
//               <div className="text-center text-xs sm:text-sm">
//                 Next Reminder:{" "}
//                 <span className="font-mono font-bold text-sm sm:text-base">
//                   {timeRemaining}
//                 </span>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader className="pb-2 sm:pb-4">
//           <CardTitle className="text-base sm:text-xl">
//             Hydration Progress
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="flex flex-col items-center space-y-2 sm:space-y-4">
//           <WaterLevel level={glassesCount} maxLevel={9} />

//           <div className="text-center text-xs sm:text-sm text-muted-foreground">
//             {glassesCount} / 9 glasses consumed
//           </div>

//           <Button
//             onClick={drinkWater}
//             disabled={glassesCount >= 9 || !isActive}
//             className="w-full text-xs sm:text-sm h-8 sm:h-10"
//           >
//             Log Water Intake
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Volume2 } from "lucide-react";
import WaterLevel from "./water-level";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function WaterNotifier() {
  const [intervalMinutes, setIntervalMinutes] = useState(1); // Changed default to 1 min
  const [customMessage, setCustomMessage] = useState("Time to drink water!");
  const [isActive, setIsActive] = useState(false);
  const [glassesCount, setGlassesCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [nextReminderTime, setNextReminderTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState("--:--");
  const [pendingNotifications, setPendingNotifications] = useState<string[]>(
    []
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    audioRef.current = new Audio("/notification.mp3");
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  const updateTimeDisplay = (target: number) => {
    if (!isClient) return;

    const now = Date.now();
    const diff = Math.max(0, target - now);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setTimeRemaining(
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
    return diff;
  };

  const startTimer = () => {
    if (!isClient) return;

    if (timerRef.current) cancelAnimationFrame(timerRef.current);

    const now = Date.now();
    const next = now + intervalMinutes * 60000;
    setNextReminderTime(next);
    updateTimeDisplay(next);

    const updateTimer = () => {
      const now = Date.now();
      const diff = updateTimeDisplay(next);

      if (diff !== undefined && diff <= 0) {
        playNotification();
        const newNext = now + intervalMinutes * 60000;
        setNextReminderTime(newNext);
        updateTimeDisplay(newNext);

        // Add notification to pending list
        setPendingNotifications((prev) => [...prev, customMessage]);
      } else {
        timerRef.current = requestAnimationFrame(updateTimer);
      }
    };

    timerRef.current = requestAnimationFrame(updateTimer);
  };

  useEffect(() => {
    if (!isClient) return;

    if (isActive) {
      startTimer();
    } else {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
        timerRef.current = null;
      }
      setTimeRemaining("--:--");
      setNextReminderTime(null);
    }

    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [isActive, intervalMinutes, isClient]);

  const playNotification = () => {
    if (!isClient) return;

    if (audioRef.current) {
      audioRef.current.play();
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(customMessage);
      }
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const drinkWater = () => {
    if (glassesCount < 8) {
      setGlassesCount(glassesCount + 1);
    } else {
      setGlassesCount(9);
      setIsCompleted(true);
      setIsActive(false);
    }
  };

  const resetApp = () => {
    setGlassesCount(0);
    setIsCompleted(false);
    setIsActive(false);
    setTimeRemaining("--:--");
    setPendingNotifications([]);
  };

  const showPendingNotifications = () => {
    if (pendingNotifications.length > 0) {
      pendingNotifications.forEach((msg) => {
        toast({
          title: "Reminder",
          description: msg,
        });
      });
      setPendingNotifications([]);
    } else {
      toast({
        title: "No New Notifications",
        description: "You don't have any pending reminders.",
      });
    }
  };

  const requestNotificationPermission = async () => {
    if (!isClient) return;

    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          toast({
            title: "Notifications Enabled",
            description:
              "You'll now receive browser notifications for reminders.",
          });
        }
      } catch (error) {
        console.error("Error requesting notification permission:", error);
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 p-2 sm:p-4">
      <Dialog open={isCompleted} onOpenChange={setIsCompleted}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              Hydration Goal Achieved! 🎉
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-muted-foreground">
            You've successfully completed your daily water intake. Well done!
          </p>
          <Button
            onClick={resetApp}
            className="mt-2 sm:mt-4 text-xs sm:text-sm"
          >
            Start New Cycle
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-xl">
            Reminder Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <div className="flex justify-between pb-1 sm:pb-2">
              <Label htmlFor="interval" className="text-xs sm:text-sm">
                Reminder Interval: {intervalMinutes} minutes
              </Label>
            </div>
            <Slider
              id="interval"
              min={1}
              max={120}
              step={1}
              value={[intervalMinutes]}
              onValueChange={(value) => setIntervalMinutes(value[0])}
              disabled={isActive}
              className="h-2 sm:h-4"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="message" className="text-xs sm:text-sm">
              Custom Message
            </Label>
            <Input
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              disabled={isActive}
              className="text-xs sm:text-sm h-8 sm:h-10"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              <Button
                onClick={toggleTimer}
                className="h-8 sm:h-12 text-xs sm:text-sm"
                variant={isActive ? "destructive" : "default"}
              >
                {isActive ? "Stop Timer" : "Start Timer"}
              </Button>
              <Button
                onClick={showPendingNotifications}
                variant="outline"
                className="h-8 sm:h-12 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm relative"
              >
                <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                Notifications
                {pendingNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {pendingNotifications.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={playNotification}
                variant="outline"
                className="h-8 sm:h-12 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                Test Sound
              </Button>
            </div>
          </div>

          {isActive && (
            <div className="mt-2 sm:mt-4 p-2 sm:p-4 bg-muted rounded-lg">
              <p className="text-center text-xs sm:text-sm">
                Next Reminder:{" "}
                <span className="font-mono font-bold text-sm sm:text-base">
                  {timeRemaining}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-xl">
            Hydration Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-2 sm:space-y-4">
          <WaterLevel level={glassesCount} maxLevel={9} />

          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            {glassesCount} / 9 glasses consumed
          </p>

          <Button
            onClick={drinkWater}
            disabled={glassesCount >= 9 || !isActive}
            className="w-full text-xs sm:text-sm h-8 sm:h-10"
          >
            Log Water Intake
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
