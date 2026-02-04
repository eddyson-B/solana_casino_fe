import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CoinflipGame {
  _id?: string;
  playerAddress: string;
  betAmount: number;
  choice: 'heads' | 'tails';
  result?: 'heads' | 'tails';
  won: boolean;
  payout?: number;
  txSignature?: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface JackpotState {
  _id?: string;
  currentPot: number;
  totalPlayers: number;
  totalTickets: number;
  entries: Array<{
    playerAddress: string;
    ticketCount: number;
    totalDeposit: number;
  }>;
  nextDrawAt: string;
  status: 'active' | 'drawing' | 'completed';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiClient = {
  async getJackpotState(): Promise<JackpotState> {
    const res = await api.get<ApiResponse<JackpotState>>('/games/jackpot/state');
    if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to fetch jackpot');
    return res.data.data;
  },

  async joinJackpot(playerAddress: string, ticketCount: number, txSignature?: string): Promise<JackpotState> {
    const res = await api.post<ApiResponse<JackpotState>>('/games/jackpot/join', {
      playerAddress,
      ticketCount,
      txSignature,
    });
    if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to join jackpot');
    return res.data.data;
  },

  async createCoinflip(
    playerAddress: string,
    betAmount: number,
    choice: 'heads' | 'tails',
    txSignature?: string
  ): Promise<CoinflipGame> {
    const res = await api.post<ApiResponse<CoinflipGame>>('/games/coinflip/create', {
      playerAddress,
      betAmount,
      choice,
      txSignature,
    });
    if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to create coinflip');
    return res.data.data;
  },

  async getCoinflipHistory(address: string): Promise<CoinflipGame[]> {
    const res = await api.get<ApiResponse<CoinflipGame[]>>(`/games/coinflip/history/${address}`);
    if (!res.data.success || !res.data.data) throw new Error(res.data.error || 'Failed to fetch history');
    return res.data.data;
  },
};
