import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isStaticSite } from "@/lib/runtimeEnv";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import AdminLogin from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Users, FileText, Briefcase, TrendingUp, Settings, Edit, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { CONSORTIUM_GROUPS, getGroupsByCategory, CATEGORY_LABELS, ConsortiumCategory } from '@shared/consortiumTypes';

// Show static site message when running without server
if (isStaticSite) {
  console.log("Running in static site mode - API features disabled");
}

interface ConsortiumSimulation {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  groupId: string;
  creditValue: string;
  useEmbedded: boolean;
  maxInstallmentValue: string;
  installmentCount: number;
  createdAt: string;
  whatsappSent?: boolean;
  whatsappSentAt?: string;
}

interface Complaint {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface JobApplication {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resumeFilename?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user, logout, isLoading } = useAuth();

  // If not authenticated, show login page
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-firme-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminDashboard user={user} onLogout={logout} />;
}

function AdminDashboard({ user, onLogout }: { user: any; onLogout: () => void }) {
  const [consortiumFilter, setConsortiumFilter] = useState<'all' | 'sent' | 'not_sent'>('all');

  // Function to download resume with authentication
  const downloadResume = async (filename: string, candidateName: string) => {
    try {
      const response = await apiRequest("GET", `/api/download-resume/${filename}`);
      
      // Check if response exists and is ok
      if (!response || !response.ok) {
        throw new Error(`Erro ao baixar arquivo: ${response?.status || 'Resposta inválida'}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        throw new Error('Arquivo não é um PDF válido');
      }

      const blob = await response.blob();
      
      // Check if blob has content
      if (blob.size === 0) {
        throw new Error('Arquivo está vazio');
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create a clean filename with candidate's name
      const cleanName = candidateName
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .toLowerCase();
      
      link.download = `curriculo_${cleanName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar currículo:', error);
      alert(`Erro ao baixar currículo: ${(error as Error).message}. Tente novamente.`);
    }
  };

  const { data: consortiumSimulations = [], isLoading: isLoadingConsortium } = useQuery({
    queryKey: ['/api/consortium-simulations'],
    enabled: !isStaticSite
  });

  const { data: complaints = [], isLoading: isLoadingComplaints } = useQuery({
    queryKey: ['/api/complaints'],
    enabled: !isStaticSite
  });

  const { data: jobApplications = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ['/api/job-applications'],
    enabled: !isStaticSite
  });

  // Filter functions
  const filteredConsortiumSimulations = consortiumSimulations.filter((simulation: ConsortiumSimulation) => {
    if (consortiumFilter === 'sent') return simulation.whatsappSent;
    if (consortiumFilter === 'not_sent') return !simulation.whatsappSent;
    return true; // 'all'
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Prepare chart data - Categorias de consórcio
  const chartData = [
    { name: 'Eletros', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'eletros').length, color: '#3B82F6' },
    { name: 'Carros', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'carro').length, color: '#10B981' },
    { name: 'Imóveis', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'imovel').length, color: '#F59E0B' },
    { name: 'Motos', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'moto').length, color: '#8B5CF6' },
    { name: 'Serviços', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'servicos').length, color: '#EF4444' },
    { name: 'Barcos', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'barco').length, color: '#06B6D4' },
    { name: 'Energia Solar', value: consortiumSimulations.filter((s: ConsortiumSimulation) => s.category === 'energia_solar').length, color: '#F97316' },
  ];

  // Monthly data for bar chart - apenas consórcios
  const getMonthlyData = () => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const targetYear = 2025; // Fixado para 2025
    
    return months.map((month, index) => {
      const consortiumCount = consortiumSimulations.filter((s: ConsortiumSimulation) =>
        new Date(s.createdAt).getMonth() === index && 
        new Date(s.createdAt).getFullYear() === targetYear
      ).length;
      
      return {
        month,
        consorcios: consortiumCount,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">ANDREOLI CONSÓRCIOS</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, {user.username}</span>
              <Button 
                onClick={onLogout} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isStaticSite && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Modo de Demonstração
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Esta é uma versão estática do painel administrativo. As funcionalidades de API estão desabilitadas no GitHub Pages.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Simulações Consórcio</CardTitle>
              <Briefcase className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{consortiumSimulations.length}</div>
              <p className="text-xs text-muted-foreground">Total de consórcios</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reclamações</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{complaints.length}</div>
              <p className="text-xs text-muted-foreground">Total de manifestações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{jobApplications.length}</div>
              <p className="text-xs text-muted-foreground">Total de currículos</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
              <CardDescription>Visão geral dos dados coletados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col xl:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        innerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [value, name]}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 w-full xl:min-w-[220px] xl:max-w-[220px]">
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Legenda</h4>
                  {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between gap-3 p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-sm flex-shrink-0" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{entry.name}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Simulações por Mês (2025)</CardTitle>
              <CardDescription>Comparativo mensal de consórcios</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={getMonthlyData()} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar 
                    dataKey="consorcios" 
                    fill="#10B981" 
                    name="Consórcios"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        

        
        {/* Data Tables */}
        <div className="grid gap-8">


          {/* Simulações de Consórcio */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Simulações de Consórcio</CardTitle>
                  <CardDescription>Total: {consortiumSimulations.length} simulações registradas | Exibindo: {filteredConsortiumSimulations.length}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Consórcios</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant={consortiumFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsortiumFilter('all')}
                >
                  Todas ({consortiumSimulations.length})
                </Button>
                <Button
                  variant={consortiumFilter === 'sent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsortiumFilter('sent')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Enviadas ({consortiumSimulations.filter((s: ConsortiumSimulation) => s.whatsappSent).length})
                </Button>
                <Button
                  variant={consortiumFilter === 'not_sent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsortiumFilter('not_sent')}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Não Enviadas ({consortiumSimulations.filter((s: ConsortiumSimulation) => !s.whatsappSent).length})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Telefone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Categoria</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Grupo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Valor Crédito</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Parcela Máx</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Parcelas</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Embutido</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Linkedin</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsortiumSimulations.map((simulation: ConsortiumSimulation) => (
                      <tr key={simulation.id} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{simulation.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{simulation.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{simulation.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {simulation.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 font-mono">{simulation.groupId}</td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600 border-r border-gray-100">R$ {parseFloat(simulation.creditValue).toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">R$ {parseFloat(simulation.maxInstallmentValue).toLocaleString('pt-BR')}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{simulation.installmentCount}x</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{simulation.useEmbedded ? 'Sim' : 'Não'}</td>
                        <td className="px-4 py-3 text-sm border-r border-gray-100">
                          {simulation.whatsappSent ? (
                            <div className="flex flex-col">
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                ✓ Enviado
                              </span>
                              {simulation.whatsappSentAt && (
                                <span className="text-xs text-gray-500 mt-1">
                                  {formatDate(simulation.whatsappSentAt)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                              Não enviado
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(simulation.createdAt)}</td>
                      </tr>
                    ))}
                    {consortiumSimulations.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                          Nenhuma simulação de consórcio encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Reclamações Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-yellow-600" />
                <span>Reclamações</span>
              </CardTitle>
              <CardDescription>Manifestações e reclamações dos clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-yellow-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Telefone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Assunto</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Mensagem</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint: Complaint) => (
                      <tr key={complaint.id} className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{complaint.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{complaint.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{complaint.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{complaint.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 max-w-xs truncate" title={complaint.message}>{complaint.message}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(complaint.createdAt)}</td>
                      </tr>
                    ))}
                    {complaints.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Nenhuma reclamação encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Candidaturas Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Candidaturas</span>
              </CardTitle>
              <CardDescription>Currículos e candidaturas recebidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Telefone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Cargo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Experiência</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Currículo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobApplications.map((application: JobApplication) => (
                      <tr key={application.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{application.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{application.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{application.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{application.resumeFilename ? 'Candidato' : 'Não informado'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">-</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                          {application.resumeFilename ? (
                          <button 
                            onClick={() => downloadResume(application.resumeFilename!, application.name)}
                            className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                          >
                            Baixar currículo
                          </button>
                        ) : (
                          <span className="text-gray-500">Não anexado</span>
                        )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(application.createdAt)}</td>
                      </tr>
                    ))}
                    {jobApplications.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          Nenhuma candidatura encontrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Grupos de Consórcio Disponíveis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Grupos de Consórcio Disponíveis</span>
              </CardTitle>
              <CardDescription>Visualize e gerencie os grupos de consórcio por categoria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
                  const groups = getGroupsByCategory(category as ConsortiumCategory);
                  const categoryColors = {
                    eletros: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                    carro: 'bg-blue-50 border-blue-200 text-blue-800',
                    automovel: 'bg-indigo-50 border-indigo-200 text-indigo-800',
                    imovel: 'bg-green-50 border-green-200 text-green-800',
                    moto: 'bg-red-50 border-red-200 text-red-800',
                    servicos: 'bg-purple-50 border-purple-200 text-purple-800',
                    pesados: 'bg-gray-50 border-gray-200 text-gray-800',
                    barco: 'bg-cyan-50 border-cyan-200 text-cyan-800',
                    energia_solar: 'bg-orange-50 border-orange-200 text-orange-800'
                  };

                  const categoryDescriptions = {
                    eletros: 'Eletrônicos e eletrodomésticos',
                    carro: 'Veículos de passeio',
                    automovel: 'Automóveis e motocicletas',
                    imovel: 'Casas e apartamentos',
                    moto: 'Motocicletas',
                    servicos: 'Prestação de serviços',
                    pesados: 'Veículos pesados e máquinas',
                    barco: 'Embarcações',
                    energia_solar: 'Sistemas de energia renovável'
                  };

                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                          <p className="text-sm text-gray-600">{categoryDescriptions[category as ConsortiumCategory]}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[category as ConsortiumCategory]}`}>
                          {groups.length} grupos
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groups.map((group) => (
                          <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900">{group.name}</h4>
                                <p className="text-sm text-gray-500">ID: {group.id}</p>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                  <ToggleRight className="h-3 w-3 text-green-600" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Taxa Admin:</span>
                                <span className="font-medium">{group.adminTax}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Duração:</span>
                                <span className="font-medium">{group.maxDuration} meses</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Participantes:</span>
                                <span className="font-medium">{group.participants}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Lance:</span>
                                <span className="font-medium">{group.minBid}% - {group.maxBid}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Reajuste:</span>
                                <span className="font-medium">{group.reajustType}</span>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 line-clamp-2" title={group.priceTableRules}>
                                {group.priceTableRules}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}