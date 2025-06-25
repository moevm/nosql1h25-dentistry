import { useState, useEffect } from "react";
import { useAdminDashboard, useAdminUsers } from "../../../hooks/apiHooks";
import styles from "./AdminDashboardPage.module.css";
import Button from "../../../components/Button";
import Card from "../../../components/Card";
import FullNameFromUser from "../../../components/FullNameFromUser";
import FilterInputField from "../../../components/FilterInputField";
import apiService from "../../../services/apiService";

const AdminDashboardPage = () => {
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useAdminDashboard();
  const [filters, setFilters] = useState({});
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError, 
    deleteUser: handleDeleteUser, 
    toggleUserActive: handleToggleUser,
    refetch: refetchUsers
  } = useAdminUsers(filters);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedTab, setSelectedTab] = useState('dashboard');

  useEffect(() => {
    refetchUsers();
  }, [filters]);

  const handleExportUsers = async () => {
    try {
      const response = await apiService.exportUsers();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Ошибка при экспорте пользователей');
    }
  };

  const handleExportRecords = async () => {
    try {
      const response = await apiService.exportRecords();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `records_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Ошибка при экспорте записей');
    }
  };

  const confirmDeleteUser = async (userId) => {
    try {
      await handleDeleteUser(userId);
      setConfirmDelete(null);
      alert('Пользователь успешно удален');
    } catch (error) {
      alert('Ошибка при удалении пользователя');
    }
  };

  const toggleUser = async (userId) => {
    try {
      await handleToggleUser(userId);
      alert('Статус пользователя изменен');
    } catch (error) {
      alert('Ошибка при изменении статуса');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderDashboard = () => {
    if (dashboardLoading) return <p>Загрузка...</p>;
    if (dashboardError) return <p className={styles.error}>Ошибка: {dashboardError}</p>;

    return (
      <div className={styles.dashboard}>
        <h2>Статистика системы</h2>
        <div className={styles.stats_grid}>
          {dashboardData?.users && (
            <div className={styles.stat_card}>
              <h3>Пользователи</h3>
              <p>Всего: {dashboardData.users?.total || 0}</p>
              <p>Активных: {dashboardData.users?.active || 0}</p>
              <p>Неактивных: {dashboardData.users?.inactive || 0}</p>
              <p>Новых за 30 дней: {dashboardData.users?.new_last_30_days || 0}</p>
            </div>
          )}
          
          {dashboardData?.users_by_role && (
            <div className={styles.stat_card}>
              <h3>По ролям</h3>
              <p>Администраторы: {dashboardData.users_by_role?.admins || 0}</p>
              <p>Пациенты: {dashboardData.users_by_role?.patients || 0}</p>
              <p>Специалисты: {dashboardData.users_by_role?.specialists || 0}</p>
            </div>
          )}
          
          {dashboardData?.records && (
            <div className={styles.stat_card}>
              <h3>Записи</h3>
              <p>Всего записей: {dashboardData.records?.total || 0}</p>
              <p>Запланированных: {dashboardData.records?.scheduled || 0}</p>
              <p>Завершенных: {dashboardData.records?.completed || 0}</p>
              <p>Отмененных: {dashboardData.records?.canceled || 0}</p>
            </div>
          )}
        </div>

        <div className={styles.export_section}>
          <h3>Экспорт данных</h3>
          <div className={styles.export_buttons}>
            <Button onClick={handleExportUsers} className={styles.export_btn}>
              Экспорт пользователей
            </Button>
            <Button onClick={handleExportRecords} className={styles.export_btn}>
              Экспорт записей
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className={styles.users_management}>
      <div className={styles.users_header}>
        <h2>Управление пользователями</h2>
        <Button onClick={refetchUsers} className={styles.refresh_btn}>
          Обновить
        </Button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Поиск по имени, email..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="">Все роли</option>
          <option value="admin">Администратор</option>
          <option value="patient">Пациент</option>
          <option value="specialist">Специалист</option>
        </select>
        <select
          value={filters.is_active}
          onChange={(e) => handleFilterChange('is_active', e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="true">Активен</option>
          <option value="false">Неактивен</option>
        </select>
      </div>

      {usersLoading && <p>Загрузка пользователей...</p>}
      {usersError && <p className={styles.error}>Ошибка: {usersError}</p>}

      <div className={styles.users_grid}>
        {users?.map((user) => (
          <div key={user.id} className={styles.user_card}>
            <div className={styles.user_info}>
              <FullNameFromUser user={user} />
              <p>Email: {user.email}</p>
              <p>Роль: {user.role}</p>
              <p>Статус: {user.is_active ? 'Активен' : 'Неактивен'}</p>
            </div>
            
            <div className={styles.user_actions}>
              <Button 
                onClick={() => toggleUser(user.id)}
                className={user.is_active ? styles.deactivate_btn : styles.activate_btn}
              >
                {user.is_active ? 'Деактивировать' : 'Активировать'}
              </Button>
              
              {user.role !== 'admin' && (
                <Button 
                  onClick={() => setConfirmDelete(user.id)}
                  className={styles.delete_btn}
                >
                  Удалить
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {confirmDelete && (
        <div className={styles.confirm_modal}>
          <div className={styles.modal_content}>
            <h3>Подтверждение удаления</h3>
            <p>Вы действительно хотите удалить пользователя?</p>
            <div className={styles.modal_actions}>
              <Button onClick={() => confirmDeleteUser(confirmDelete)} className={styles.confirm_btn}>
                Да, удалить
              </Button>
              <Button onClick={() => setConfirmDelete(null)} className={styles.cancel_btn}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.admin_page}>
      <div className={styles.tabs}>
        <button 
          className={selectedTab === 'dashboard' ? styles.active_tab : styles.tab}
          onClick={() => setSelectedTab('dashboard')}
        >
          Дашборд
        </button>
        <button 
          className={selectedTab === 'users' ? styles.active_tab : styles.tab}
          onClick={() => setSelectedTab('users')}
        >
          Пользователи
        </button>
      </div>

      <div className={styles.tab_content}>
        {selectedTab === 'dashboard' && renderDashboard()}
        {selectedTab === 'users' && renderUsers()}
      </div>
    </div>
  );
};

export default AdminDashboardPage; 