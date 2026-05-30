import type { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const dashboardService = new DashboardService();

export class DashboardController {
  private getEmpresaId(req: Request): string {

    const usuarioLogado = (req as any).user || (req as any).usuario;
    if (usuarioLogado?.empresaId) {
      return usuarioLogado.empresaId;
    }
    return String(req.query.empresaId || "empresa-padrao");
  }

  getResumo = async (req: Request, res: Response): Promise<void> => {
    try {
      const empresaId = this.getEmpresaId(req);
      const dados = await dashboardService.getResumo(empresaId);
      res.status(200).json(dados);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Erro ao buscar resumo do dashboard", 
        message: error.message 
      });
    }
  };

  getAtivos = async (req: Request, res: Response): Promise<void> => {
    try {
      const empresaId = this.getEmpresaId(req);
      const dados = await dashboardService.getAtivos(empresaId);
      res.status(200).json(dados);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Erro ao buscar dados de ativos para o dashboard", 
        message: error.message 
      });
    }
  };

  getOrdensServico = async (req: Request, res: Response): Promise<void> => {
    try {
      const empresaId = this.getEmpresaId(req);
      const dados = await dashboardService.getOrdensServico(empresaId);
      res.status(200).json(dados);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Erro ao buscar ordens de serviço para o dashboard", 
        message: error.message 
      });
    }
  };

  getMateriais = async (req: Request, res: Response): Promise<void> => {
    try {
      const empresaId = this.getEmpresaId(req);
      const dados = await dashboardService.getMateriais(empresaId);
      res.status(200).json(dados);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Erro ao buscar materiais para o dashboard", 
        message: error.message 
      });
    }
  };

  getCustos = async (req: Request, res: Response): Promise<void> => {
    try {
      const empresaId = this.getEmpresaId(req);
      const dados = await dashboardService.getCustos(empresaId);
      res.status(200).json(dados);
    } catch (error: any) {
      res.status(500).json({ 
        error: "Erro ao buscar custos para o dashboard", 
        message: error.message 
      });
    }
  };
}