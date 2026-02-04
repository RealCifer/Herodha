export interface Stock {

  symbol: string;          
  name: string;             
  exchange: "NSE" | "BSE";  
  sector: string;           
  purchasePrice: number;   
  quantity: number;        

  cmp?: number;            
  peRatio?: number;         
  latestEarnings?: string; 

  investment?: number;     
  presentValue?: number;    
  gainLoss?: number;        
  portfolioPercent?: number;
  
}
