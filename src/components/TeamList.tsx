import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, User as UserIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { sendInvitationEmail } from '../lib/emailService';

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'pending' | 'active';
  invited_at: string;
}

// Local Storage helper functions
const getStoredMembers = (): TeamMember[] => {
  const stored = localStorage.getItem('team_members');
  return stored ? JSON.parse(stored) : [];
};

const storeMembers = (members: TeamMember[]) => {
  localStorage.setItem('team_members', JSON.stringify(members));
};

const DEFAULT_ADMIN_EMAIL = 'juliocamposmachado@gmail.com';

export default function TeamList() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = () => {
    try {
      const storedMembers = getStoredMembers();
      setMembers(storedMembers);
    } catch (error) {
      console.error('Error loading team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingInvite(true);
    setError('');
    setSuccess('');
    
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      email: inviteEmail,
      full_name: '',
      role: 'member',
      status: 'pending',
      invited_at: new Date().toISOString()
    };

    try {
      // Enviar email real
      await sendInvitationEmail({
        to_email: inviteEmail,
        from_name: 'GlobalForests Team',
        message: `You have been invited to join the GlobalForests team. Please click the link below to accept the invitation and create your account.`
      });

      // Atualizar estado local
      const updatedMembers = [...members, newMember];
      storeMembers(updatedMembers);
      setMembers(updatedMembers);
      setSuccess('Invitation sent successfully!');
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteForm(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error inviting member:', error);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setSendingInvite(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Team Members</h2>
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          <UserPlus className="h-5 w-5" />
          <span>Invite Member</span>
        </button>
      </div>

      {showInviteForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <form onSubmit={handleInvite}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
                disabled={sendingInvite}
              />
              <p className="text-sm text-gray-500 mt-1">
                Invitation will be sent from: {DEFAULT_ADMIN_EMAIL}
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={sendingInvite}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 flex items-center space-x-2"
                disabled={sendingInvite}
              >
                {sendingInvite ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Invitation</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Membros Ativos */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Active Members</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.filter(member => member.status === 'active').map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <UserIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {member.full_name || 'Unnamed Member'}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Convites Pendentes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Invitations</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invited At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.filter(member => member.status === 'pending').map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(member.invited_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}