import { UUID } from "crypto";

export interface Farmer {
      id: UUID,
      firstName: string,
      lastName: string,
      phone: string,
      email: string,
      country: string,
      region: string,
      commune: string,
      village: string,
      code: string,
      createdAt: Date,
      isFavorite: Boolean,
      status: string, //Utilisation de Websocket
      messages : string // websocket ou juste useEffect
      demand : string // Demande d'adhérer au programme
}
{/*
    FARMER EXEMPLE 

      id: 1,
      firstName: "Mamadou",
      lastName: "Diallo",
      phone: "+221 77 123 45 67",
      email: "mamadou.diallo@gmail.com",
      country: "sn",
      region: "thies",
      commune: "mbour",
      village: "saly",
      code: "A3B#K9P2",
      createdAt: "2024-01-15",
      isFavorite: true,
      status: "active",
    */}