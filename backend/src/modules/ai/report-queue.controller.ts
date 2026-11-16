import type { Request, Response } from 'express';
import { reportQueue } from './queue/reportQueue.js';

export const requestReport = async (req: Request, res: Response) => {
  try {
    const { userId, filters } = req.body;
    
    const job = await reportQueue.add('gerar-relatorio', { userId, filters });
    
    res.status(202).json({ 
      message: 'Pedido de relatório aceite', 
      jobId: job.id 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido de relatório' });
  }
};

export const getReportStatus = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await reportQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const state = await job.getState();
    const result = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({ id: job.id, state, result, failedReason });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao consultar o status' });
  }
};