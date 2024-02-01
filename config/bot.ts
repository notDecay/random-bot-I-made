import { 
  ActivityType, 
  type ActivityOptions, 
  type PresenceStatusData 
} from "discord.js"

export const botConfig = {
  activity: [
    {
      name: 'some cat',
      type: ActivityType.Watching
    }
  ] satisfies ActivityOptions[],
  status: 'idle' satisfies PresenceStatusData
} as const