// src/storage/eventApi.ts

// Geramos os dados estáticos fora da função para simular o banco de dados
const MOCK_DATABASE = Array.from({ length: 60 }).map((_, index) => ({
  id: index.toString(),
  title: `Evento Universitário ${index + 1}`,
  organizer: index % 2 === 0 ? "ECA Jr." : "Centro Acadêmico",
  location: "Vala da FAUD-USP",
  dates: "07/08/26",
  time: "13:00",
  free: index % 3 === 0,
}));

export interface EventFilters {
  busca?: string;
  categoria?: string | null;
  orgName?: string;
  creatorName?: string;
  dateAfter?: string;
  dateBefore?: string;
  timeAfter?: string;
  timeBefore?: string;
  sortBy?: 'date_asc' | 'date_desc' | 'likes';
}

// Esta interface espelha o 'PaginatedEventResponse' do backend
export interface PaginatedResponse {
  pagina_atual: number;
  total_eventos: number;
  dados: typeof MOCK_DATABASE;
}

export const getEvents = async (
  pagina: number = 1, 
  limite: number = 20,
  filtros?: EventFilters
): Promise<PaginatedResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let dadosFiltrados = MOCK_DATABASE;

      if (filtros) {
        // Filtro de Busca (Título)
        if (filtros.busca) {
          dadosFiltrados = dadosFiltrados.filter(e => 
            e.title.toLowerCase().includes(filtros.busca!.toLowerCase())
          );
        }

        // Filtro de Categoria
        if (filtros.categoria) {
          // Nota: Como o MOCK não tem o campo categoria ainda, 
          // adicione a lógica correspondente quando o campo existir
          // dadosFiltrados = dadosFiltrados.filter(e => e.category === filtros.categoria);
        }

        // Filtro de Organização
        if (filtros.orgName) {
          dadosFiltrados = dadosFiltrados.filter(e => 
            e.organizer.toLowerCase().includes(filtros.orgName!.toLowerCase())
          );
        }

        // Ordenação
        if (filtros.sortBy) {
          if (filtros.sortBy === 'date_asc') {
            // Lógica de ordenação por data (crescente)
          } else if (filtros.sortBy === 'date_desc') {
            // Lógica de ordenação por data (decrescente)
          } else if (filtros.sortBy === 'likes') {
            // dadosFiltrados.sort((a, b) => b.likes - a.likes);
          }
        }
      }

      // Paginação
      const offset = (pagina - 1) * limite;
      const paginatedData = dadosFiltrados.slice(offset, offset + limite);

      resolve({
        pagina_atual: pagina,
        total_eventos: dadosFiltrados.length,
        dados: paginatedData,
      });
    }, 500);
  });
};