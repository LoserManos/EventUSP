import { Alert } from 'react-native';
import { orgService } from '@/services/orgService';
import { Dispatch, SetStateAction } from 'react';
import { User } from '@/types/user';
import { Organization } from '@/types/org';

export function useOrgActions(
  orgId: number,
  membershipStatus: 'none' | 'pending' | 'member',
  setMembershipStatus: (status: 'none' | 'pending' | 'member') => void,
  setPendingList: Dispatch<SetStateAction<User[]>>,
  setPendingCount: Dispatch<SetStateAction<number>>,
  setMembersList: Dispatch<SetStateAction<User[]>>,
  setMembersCount: Dispatch<SetStateAction<number>>,
  setOrg: Dispatch<SetStateAction<Organization | null>>,
  router: any,
  setModalType: (type: any) => void
) {
  const handleMembershipAction = () => {
    if (membershipStatus === 'member') {
      Alert.alert(
        "Sair da Organização",
        "Tem certeza que deseja sair desta organização?",
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Sair", 
            style: "destructive", 
            onPress: async () => {
              try {
                await orgService.leaveOrg(orgId);
                setMembershipStatus('none');
              } catch (error) {
                console.error("Erro ao sair:", error);
              }
            } 
          }
        ]
      );
    } else if (membershipStatus === 'none') {
      orgService.joinOrg(orgId).then(() => {
        setMembershipStatus('pending');
      }).catch(err => console.error("Erro ao solicitar entrada:", err));
    }
  };

  const handleAcceptMember = async (userId: number, pendingList: User[]) => {
    try {
      await orgService.approveMember(orgId, userId);
      const acceptedUser = pendingList.find(u => u.id === userId);
      if (acceptedUser) {
        setPendingList(prev => prev.filter(u => u.id !== userId));
        setPendingCount(prev => prev - 1);
        setMembersList(prev => [...prev, acceptedUser]);
        setMembersCount(prev => prev + 1);
      }
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.detail || "Não foi possível aceitar o membro.");
    }
  };

  const handleDeleteOrg = () => {
    Alert.alert(
      "Excluir Organização",
      "Tem certeza absoluta que deseja excluir esta organização?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await orgService.deleteOrg(orgId);
              router.replace('/(tabs)');
            } catch (error) {
              console.error("Erro ao excluir:", error);
            }
          }
        }
      ]
    );
  };

  const handleTransferOwnership = (userId: number, userName: string) => {
    Alert.alert(
      "Transferir Posse",
      `Deseja transferir a propriedade da organização para ${userName}? Você se tornará um administrador.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          style: "destructive",
          onPress: async () => {
            try {
              await orgService.transferOwnership(orgId, userId);
              setOrg(prev => prev ? { ...prev, creator_id: userId } : prev);
              setModalType(null);
              Alert.alert("Sucesso", "A posse da organização foi transferida com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.response?.data?.detail || "Não foi possível transferir a posse.");
            }
          } 
        }
      ]
    );
  };

  const handleRoleToggle = async (userId: number, userName: string, isCurrentlyAdmin: boolean, setMembersList: any) => {
    const actionName = isCurrentlyAdmin ? 'rebaixar para membro' : 'promover a administrador';

    Alert.alert(
      "Alterar Cargo",
      `Deseja ${actionName} o usuário ${userName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: async () => {
            try {
              if (isCurrentlyAdmin) {
                await orgService.DemoteMember(orgId, userId);
              } else {
                await orgService.PromoteMember(orgId, userId);
              }
              
              const newOrgRole = isCurrentlyAdmin ? 'member' : 'admin';
              setMembersList((prev: User[]) => prev.map(u => 
                u.id === userId ? { ...u, role: newOrgRole } : u
              ));
              
              Alert.alert("Sucesso", "Cargo atualizado com sucesso!");
            } catch (error: any) {
              Alert.alert("Erro", error.response?.data?.detail || "Não foi possível alterar o cargo.");
            }
          } 
        }
      ]
    );
  };

  return {
    handleMembershipAction,
    handleAcceptMember,
    handleDeleteOrg,
    handleTransferOwnership,
    handleRoleToggle,
  };
}