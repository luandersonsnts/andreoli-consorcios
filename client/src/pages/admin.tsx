import { useState } from "react";
import { useEffect, useState as useStateForData } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { isStaticSite } from "@/lib/runtimeEnv";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import AdminLogin from "@/components/AdminLogin";
import PasswordReset from "@/components/PasswordReset";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, Users, FileText, Briefcase, TrendingUp, Settings, Edit, Eye, ToggleLeft, ToggleRight, Key } from 'lucide-react';
import { CONSORTIUM_GROUPS, getGroupsByCategory, CATEGORY_LABELS, ConsortiumCategory, getCategoryLabelFromRaw } from '@shared/consortiumTypes';

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

  // DEBUG: Log authentication state
  console.log("🔍 DEBUG AdminPage - isLoading:", isLoading);
  console.log("🔍 DEBUG AdminPage - user:", user);
  console.log("🔍 DEBUG AdminPage - token no localStorage:", localStorage.getItem('admin_token') ? 'EXISTE' : 'NÃO EXISTE');

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
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [adminConfig, setAdminConfig] = useState<{ premiacaoEnabled: boolean; campaignLabel: string } | null>(null);
  const [campaignLabelUi, setCampaignLabelUi] = useState<string>('dezembro');

  // Helpers de persistência local para manter o estado mesmo sem API
  const readLocalAdminConfig = (): { premiacaoEnabled: boolean; campaignLabel: string } | null => {
    try {
      const raw = localStorage.getItem('global_config');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.premiacaoEnabled === 'boolean') {
        return {
          premiacaoEnabled: Boolean(parsed.premiacaoEnabled),
          campaignLabel: String(parsed.campaignLabel ?? 'dezembro').toLowerCase(),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const writeLocalAdminConfig = (cfg: { premiacaoEnabled: boolean; campaignLabel: string }) => {
    try {
      localStorage.setItem('global_config', JSON.stringify(cfg));
    } catch {}
  };

  // Função para mostrar informação sobre currículo
  const showResumeInfo = (filename: string, candidateName: string) => {
    alert(`Currículo salvo localmente: ${filename}\nCandidato: ${candidateName}\n\nEm um ambiente de produção, o arquivo seria baixado do servidor.`);
  };

  // Debug das variáveis de ambiente
  console.log("🌍 DEBUG: VITE_STATIC_SITE env var:", import.meta.env.VITE_STATIC_SITE);
  console.log("🌍 DEBUG: isStaticSite value:", isStaticSite);
  console.log("🌍 DEBUG: typeof isStaticSite:", typeof isStaticSite);
  console.log("🌍 DEBUG: !isStaticSite (enabled):", !isStaticSite);

  // Carregar dados do backend usando useQuery
  console.log("🔍 DEBUG: Configurando useQuery para consortium-simulations");
  console.log("🔍 DEBUG: enabled (!isStaticSite):", !isStaticSite);
  
  const { data: consortiumSimulations = [], isLoading: isLoadingConsortium, error: consortiumError } = useQuery({
    queryKey: ["/api/consortium-simulations"],
    queryFn: async () => {
      console.log("🔍 DEBUG: Iniciando requisição para /api/consortium-simulations");
      console.log("🔍 DEBUG: Token no localStorage:", localStorage.getItem('admin_token') ? 'EXISTE' : 'NÃO EXISTE');
      console.log("🔍 DEBUG: isStaticSite:", isStaticSite);
      
      const response = await apiRequest("GET", "/api/consortium-simulations");
      console.log("🔍 DEBUG: Status da resposta:", response.status);
      
      if (!response.ok) {
        console.error("🔍 DEBUG: Erro na resposta:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("🔍 DEBUG: Texto do erro:", errorText);
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("🔍 DEBUG: Dados de consórcio recebidos:", data);
      console.log("🔍 DEBUG: Quantidade de simulações:", data.length);
      return data;
    },
    enabled: true // FORÇANDO EXECUÇÃO PARA TESTE
  });

  // Carregar configuração global (premiação)
  const { data: fetchedConfig, isLoading: isLoadingConfig } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/config");
      return response.json();
    },
    // Evita consulta quando não há token ou quando é site estático
    enabled: !isStaticSite && Boolean(localStorage.getItem('admin_token')),
    retry: false,
  });

  useEffect(() => {
    // 1) Prioriza configuração local, se existir
    const localCfg = readLocalAdminConfig();
    if (localCfg) {
      setAdminConfig(localCfg);
      setCampaignLabelUi(String(localCfg.campaignLabel).toLowerCase());
    }

    // 2) Se veio do servidor, só atualiza se não houver local ou se servidor estiver habilitando (true)
    if (fetchedConfig) {
      const serverCfg = fetchedConfig as { premiacaoEnabled: boolean; campaignLabel: string };
      const shouldOverride = !localCfg || serverCfg.premiacaoEnabled === true;
      const nextCfg = shouldOverride ? serverCfg : localCfg;
      setAdminConfig(nextCfg);
      writeLocalAdminConfig(nextCfg);
      const label = (nextCfg as any).campaignLabel ?? 'dezembro';
      setCampaignLabelUi(String(label).toLowerCase());
    }
  }, [fetchedConfig]);

  const updateConfigMutation = useMutation({
    mutationFn: async (partial: Partial<{ premiacaoEnabled: boolean; campaignLabel: string }>) => {
      const response = await apiRequest("PATCH", "/api/admin/config", partial);
      return response.json();
    },
    // Optimistic UI: aplica imediatamente e reverte se der erro
    onMutate: async (partial) => {
      setAdminConfig((prev) => {
        const next = {
          premiacaoEnabled: partial.premiacaoEnabled ?? (prev?.premiacaoEnabled ?? false),
          campaignLabel: partial.campaignLabel ?? (prev?.campaignLabel ?? campaignLabelUi),
        };
        // Sincroniza seletor de mês
        setCampaignLabelUi(String(next.campaignLabel).toLowerCase());
        // Persiste imediatamente para sobreviver a recarregamentos
        writeLocalAdminConfig(next);
        return next;
      });
    },
    onSuccess: (data) => {
      const cfg = data as { premiacaoEnabled: boolean; campaignLabel: string };
      setAdminConfig(cfg);
      setCampaignLabelUi(String(cfg.campaignLabel).toLowerCase());
      writeLocalAdminConfig(cfg);
    },
    onError: (_error, _variables, _context) => {
      // Em caso de erro, re-carrega do servidor para manter consistência
      console.error('Falha ao atualizar configuração global');
      // Mantém estado local para não perder a configuração após reload
      const localCfg = readLocalAdminConfig();
      if (localCfg) {
        setAdminConfig(localCfg);
        setCampaignLabelUi(String(localCfg.campaignLabel).toLowerCase());
      }
    },
    onSettled: () => {
      // Garante estado sincronizado com backend
      // Evita refetch agressivo quando isStaticSite está ativo
      if (!isStaticSite) {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/config"] });
      }
    },
  });
  
  console.log("🔍 DEBUG: useQuery consortium - isLoading:", isLoadingConsortium);
  console.log("🔍 DEBUG: useQuery consortium - error:", consortiumError);
  console.log("🔍 DEBUG: useQuery consortium - data length:", consortiumSimulations.length);

  const { data: complaints = [], isLoading: isLoadingComplaints } = useQuery({
    queryKey: ["/api/complaints"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/complaints");
      const data = await response.json();
      console.log("🔍 DEBUG: Dados de reclamações recebidos:", data);
      console.log("🔍 DEBUG: Quantidade de reclamações:", data.length);
      return data;
    },
    enabled: true // FORÇANDO EXECUÇÃO PARA TESTE
  });

  const { data: jobApplications = [], isLoading: isLoadingJobs } = useQuery({
    queryKey: ["/api/job-applications"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/job-applications");
      const data = await response.json();
      console.log("🔍 DEBUG: Dados de candidaturas recebidos:", data);
      console.log("🔍 DEBUG: Quantidade de candidaturas:", data.length);
      return data;
    },
    enabled: !isStaticSite && !!user
  });

  // Estados para dados do localStorage (fallback para modo estático)
  const [localConsortiumSimulations, setLocalConsortiumSimulations] = useStateForData<ConsortiumSimulation[]>([]);
  const [localComplaints, setLocalComplaints] = useStateForData<Complaint[]>([]);
  const [localJobApplications, setLocalJobApplications] = useStateForData<JobApplication[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useStateForData(true);

  // Carregar dados do localStorage apenas em modo estático
  useEffect(() => {
    if (isStaticSite) {
      const loadLocalStorageData = () => {
        try {
          // Suporte a ambos formatos de chave para compatibilidade
          const storedConsortiumSimulations = JSON.parse(
            localStorage.getItem('consortium-simulations') ||
            localStorage.getItem('consortiumSimulations') ||
            '[]'
          );
          const storedComplaints = JSON.parse(localStorage.getItem('complaints') || '[]');
          const storedJobApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');

          setLocalConsortiumSimulations(storedConsortiumSimulations);
          setLocalComplaints(storedComplaints);
          setLocalJobApplications(storedJobApplications);
        } catch (error) {
          console.error('Erro ao carregar dados do localStorage:', error);
        } finally {
          setIsLoadingLocal(false);
        }
      };

      loadLocalStorageData();
    }
  }, []);

  // CORREÇÃO: Forçar uso dos dados da API em desenvolvimento
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const useApiData = isDevelopment || !isStaticSite;
  
  // Usar dados do backend ou localStorage dependendo do modo
  const finalConsortiumSimulations = useApiData ? consortiumSimulations : localConsortiumSimulations;
  const finalComplaints = useApiData ? complaints : localComplaints;
  const finalJobApplications = useApiData ? jobApplications : localJobApplications;
  const isLoadingData = useApiData ? (isLoadingConsortium || isLoadingComplaints || isLoadingJobs) : isLoadingLocal;

  // Debug logs
  console.log("🔍 DEBUG: isStaticSite:", isStaticSite, typeof isStaticSite);
  console.log("🔍 DEBUG: isDevelopment:", isDevelopment);
  console.log("🔍 DEBUG: useApiData:", useApiData);
  console.log("🔍 DEBUG: consortiumSimulations (API):", consortiumSimulations);
  console.log("🔍 DEBUG: localConsortiumSimulations (localStorage):", localConsortiumSimulations);
  console.log("🔍 DEBUG: finalConsortiumSimulations (escolhido):", finalConsortiumSimulations);
  console.log("🔍 DEBUG: finalComplaints:", finalComplaints);
  console.log("🔍 DEBUG: finalJobApplications:", finalJobApplications);
  console.log("🔍 DEBUG: isLoadingData:", isLoadingData);

  // Filter functions
  const filteredConsortiumSimulations = (finalConsortiumSimulations as ConsortiumSimulation[]).filter((simulation) => {
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
    { name: 'Eletros', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.category === 'eletros').length, color: '#3B82F6' },
    { name: 'Carros', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.category === 'carro' || s.category === 'automovel').length, color: '#10B981' },
    { name: 'Imóveis', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s) => s.category === 'imovel' || s.category === 'Imóvel').length, color: '#F59E0B' },
    { name: 'Motos', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.category === 'moto').length, color: '#8B5CF6' },
    { name: 'Serviços', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.category === 'servicos').length, color: '#EF4444' },
    { name: 'Barcos', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.category === 'barco').length, color: '#06B6D4' },
    { name: 'Energia Solar', value: (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.category === 'energia_solar').length, color: '#F97316' },
  ];

  // Monthly data for bar chart - apenas consórcios
  const getMonthlyData = () => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const targetYear = 2025; // Fixado para 2025
    
    return months.map((month, index) => {
      const consortiumCount = (finalConsortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) =>
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
                onClick={() => setShowPasswordReset(true)} 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <Key className="h-4 w-4" />
                <span>Redefinir Senha</span>
              </Button>
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
        {/* Controle de Premiação/Roleta */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-sm font-medium">Premiação/Roleta</CardTitle>
                <CardDescription>Controle global de exibição da oferta</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {adminConfig?.premiacaoEnabled ? (
                  <ToggleRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isStaticSite ? (
                <p className="text-sm text-gray-600">Modo estático — controle indisponível sem servidor.</p>
              ) : (
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Status:</span>
                    <span className={`text-sm font-medium ${adminConfig?.premiacaoEnabled ? 'text-green-700' : 'text-gray-600'}`}>
                      {adminConfig?.premiacaoEnabled ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-700">Mês/Campanha:</span>
                    <select
                      className="text-sm border rounded-md px-2 py-1"
                      value={campaignLabelUi}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCampaignLabelUi(val);
                        updateConfigMutation.mutate({ campaignLabel: val });
                      }}
                      disabled={updateConfigMutation.isPending}
                    >
                      <option value="janeiro">janeiro</option>
                      <option value="fevereiro">fevereiro</option>
                      <option value="março">março</option>
                      <option value="abril">abril</option>
                      <option value="maio">maio</option>
                      <option value="junho">junho</option>
                      <option value="julho">julho</option>
                      <option value="agosto">agosto</option>
                      <option value="setembro">setembro</option>
                      <option value="outubro">outubro</option>
                      <option value="novembro">novembro</option>
                      <option value="dezembro">dezembro</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={adminConfig?.premiacaoEnabled ? 'destructive' : 'default'}
                      onClick={() => updateConfigMutation.mutate({ premiacaoEnabled: !(adminConfig?.premiacaoEnabled ?? false), campaignLabel: campaignLabelUi })}
                      disabled={updateConfigMutation.isPending}
                      className={`flex items-center gap-2 ${adminConfig?.premiacaoEnabled ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}
                    >
                      {adminConfig?.premiacaoEnabled ? 'Desativar' : 'Ativar'}
                    </Button>
                    {updateConfigMutation.isPending && (
                      <span className="text-xs text-gray-500">Salvando...</span>
                    )}
                  </div>
                  {/* Ajuda: primeira parcela (M+2) */}
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    {(() => {
                      const meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
                      const label = (campaignLabelUi || 'dezembro').toLowerCase();
                      const idx = meses.indexOf(label);
                      const eff = idx >= 0 ? idx : meses.indexOf('dezembro');
                      const parcelaMes = meses[(eff + 2) % 12];
                      return <span>Primeira parcela em {parcelaMes}</span>;
                    })()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {isLoadingData && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-firme-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados...</p>
          </div>
        )}

        {!isLoadingData && (
          <>
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
                      <p>Painel administrativo usando localStorage. Os dados são salvos localmente no navegador e exibidos aqui para demonstração.</p>
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
              <div className="text-2xl font-bold text-green-600">
                {(() => {
                  const count = (finalConsortiumSimulations as ConsortiumSimulation[]).length;
                  console.log("🎯 RENDERIZAÇÃO: Contagem de simulações:", count);
                  console.log("🎯 RENDERIZAÇÃO: finalConsortiumSimulations:", finalConsortiumSimulations);
                  return count;
                })()}
              </div>
              <p className="text-xs text-muted-foreground">Total de consórcios</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reclamações</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{(finalComplaints as Complaint[]).length}</div>
              <p className="text-xs text-muted-foreground">Total de manifestações</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidaturas</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{(finalJobApplications as JobApplication[]).length}</div>
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
                  <CardDescription>Total: {(finalConsortiumSimulations as ConsortiumSimulation[]).length} simulações registradas | Exibindo: {filteredConsortiumSimulations.length}</CardDescription>
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
                  Todas ({(consortiumSimulations as ConsortiumSimulation[]).length})
                </Button>
                <Button
                  variant={consortiumFilter === 'sent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsortiumFilter('sent')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Enviadas ({(consortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => s.whatsappSent).length})
                </Button>
                <Button
                  variant={consortiumFilter === 'not_sent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setConsortiumFilter('not_sent')}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Não Enviadas ({(consortiumSimulations as ConsortiumSimulation[]).filter((s: ConsortiumSimulation) => !s.whatsappSent).length})
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
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
                            {getCategoryLabelFromRaw(simulation.category)}
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
                    {filteredConsortiumSimulations.length === 0 && (
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
                    {(finalComplaints as Complaint[]).map((complaint: Complaint) => (
                      <tr key={complaint.id} className="border-b border-gray-100 hover:bg-yellow-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{complaint.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{complaint.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{complaint.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{complaint.subject}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100 max-w-xs truncate" title={complaint.message}>{complaint.message}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(complaint.createdAt)}</td>
                      </tr>
                    ))}
                    {(finalComplaints as Complaint[]).length === 0 && (
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
                    {(finalJobApplications as JobApplication[]).map((application: JobApplication) => (
                      <tr key={application.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{application.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{application.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{application.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">{application.resumeFilename ? 'Candidato' : 'Não informado'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">-</td>
                        <td className="px-4 py-3 text-sm text-gray-600 border-r border-gray-100">
                          {application.resumeFilename ? (
                          <button 
                            onClick={() => showResumeInfo(application.resumeFilename!, application.name)}
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
                    {(finalJobApplications as JobApplication[]).length === 0 && (
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
                    automovel: 'Carros',
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
          </>
        )}

        {/* Password Reset Modal */}
        {showPasswordReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <PasswordReset
                onCancel={() => setShowPasswordReset(false)}
                onSuccess={() => {
                  setShowPasswordReset(false);
                  // Optionally, you could logout the user after password change
                  // onLogout();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}