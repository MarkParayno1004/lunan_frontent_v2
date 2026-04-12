import { Client, Conversation, Paginator, Message } from "@twilio/conversations";

export class TwilioChatService {
  private static instance: TwilioChatService;
  private client: Client | null = null;
  private token: string | null = null;
  private identity: string | null = null;

  private constructor() {}

  public static getInstance(): TwilioChatService {
    if (!TwilioChatService.instance) {
      TwilioChatService.instance = new TwilioChatService();
    }
    return TwilioChatService.instance;
  }

  public async initialize(token: string, identity: string): Promise<void> {
    if (this.client && this.token === token) return;

    this.token = token;
    this.identity = identity;
    this.client = new Client(token);

    return new Promise((resolve, reject) => {
      this.client?.on("stateChanged", (state) => {
        if (state === "initialized") {
          resolve();
        } else if (state === "failed") {
          reject(new Error("Twilio client initialization failed"));
        }
      });
    });
  }

  public async getOrCreateConversation(uniqueName: string, friendlyName: string): Promise<Conversation> {
    if (!this.client) throw new Error("Twilio Client not initialized");

    try {
      return await this.client.getConversationByUniqueName(uniqueName);
    } catch (error: any) {
      if (error.status === 404) {
        const conversation = await this.client.createConversation({
          uniqueName,
          friendlyName,
        });
        
        // Add current user as participant
        try {
          await conversation.add(this.identity!);
        } catch (e) {
          console.warn("User might already be a participant", e);
        }
        
        return conversation;
      }
      throw error;
    }
  }

  public async addParticipant(conversation: Conversation, identity: string): Promise<void> {
    try {
      await conversation.add(identity);
    } catch (error) {
      console.warn(`Could not add participant ${identity}:`, error);
    }
  }

  public async getMessages(conversation: Conversation): Promise<Message[]> {
    const paginator: Paginator<Message> = await conversation.getMessages();
    return paginator.items;
  }

  public async sendMessage(conversation: Conversation, text: string): Promise<string> {
    return await conversation.sendMessage(text);
  }

  public onMessageAdded(conversation: Conversation, callback: (message: Message) => void) {
    conversation.on("messageAdded", callback);
    return () => conversation.off("messageAdded", callback);
  }

  public async shutdown(): Promise<void> {
    if (this.client) {
      await this.client.shutdown();
      this.client = null;
      this.token = null;
    }
  }
}
