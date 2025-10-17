import { useQuery } from "@tanstack/react-query";
import { isStaticSite } from "@/lib/runtimeEnv";
import { apiRequest } from "@/lib/queryClient";

// Show static site message when running without server
if (isStaticSite) {
  console.log("Running in static site mode - API features disabled");
}

interface Simulation {
  id: string;
  name: string;
  email: string;
  phone: string;
  objective: string;
  monthlyAmount: string;
  timeframe: string;
  createdAt: string;
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
}

interface Complaint {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  subject: string;
  message: string;
  contactAuthorized: string;
  createdAt: string;
}

interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeFilename?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: simulations = [] } = useQuery({
    queryKey: ["/api/simulations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/simulations");
      return response.json();
    },
    enabled: !isStaticSite
  });

  const { data: consortiumSimulations = [] } = useQuery({
    queryKey: ["/api/consortium-simulations"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/consortium-simulations");
      return response.json();
    },
    enabled: !isStaticSite
  });

  const { data: complaints = [] } = useQuery({
    queryKey: ["/api/complaints"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/complaints");
      return response.json();
    },
    enabled: !isStaticSite
  });

  const { data: jobApplications = [] } = useQuery({
    queryKey: ["/api/job-applications"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/job-applications");
      return response.json();
    },
    enabled: !isStaticSite
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Painel Administrativo - FIRME INVESTIMENTOS</h1>
        
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
        
        <div className="grid gap-8">
          {/* Simulações de Investimento */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Simulações de Investimento ({simulations.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objetivo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Mensal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {simulations.map((simulation: Simulation) => (
                    <tr key={simulation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.objective}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.monthlyAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(simulation.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simulações de Consórcio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Simulações de Consórcio ({consortiumSimulations.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Crédito</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcela Máx</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parcelas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Embutido</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consortiumSimulations.map((simulation: ConsortiumSimulation) => (
                    <tr key={simulation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {simulation.category === 'automovel' ? 'Automóvel' : 
                           simulation.category === 'imovel' ? 'Imóvel' :
                           simulation.category === 'servicos' ? 'Serviços' : 
                           simulation.category === 'pesados' ? 'Pesados' : simulation.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{simulation.groupId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {parseFloat(simulation.creditValue).toLocaleString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {parseFloat(simulation.maxInstallmentValue).toLocaleString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.installmentCount}x</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{simulation.useEmbedded ? 'Sim' : 'Não'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(simulation.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reclamações */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Reclamações - Reclame Aqui ({complaints.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.map((complaint: Complaint) => (
                    <tr key={complaint.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{complaint.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(complaint.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Candidatos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Candidaturas ({jobApplications.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currículo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobApplications.map((application: JobApplication) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.resumeFilename ? 'Enviado' : 'Não enviado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(application.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}