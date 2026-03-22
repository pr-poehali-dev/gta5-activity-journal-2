import Icon from "@/components/ui/icon";
import HudTable from "@/components/shared/HudTable";
import {
  Player, Organization, Role, TableSheet,
  COL_ID_VERBAL, COL_ID_REPRIMAND,
} from "@/lib/types";

interface TabTablesProps {
  viewerRole: Role;
  players: Player[];
  myOrg: Organization | null;
  orgTable: TableSheet;
  adminTable: TableSheet;
  onOrgTableChange: (t: TableSheet) => void;
  onAdminTableChange: (t: TableSheet) => void;
}

export default function TabTables({
  viewerRole, players, myOrg,
  orgTable, adminTable, onOrgTableChange, onAdminTableChange,
}: TabTablesProps) {
  const canSeeAdmin     = viewerRole === "curator" || viewerRole === "curator_admin";
  const canSeeOrg       = viewerRole === "leader" || viewerRole === "curator" || viewerRole === "curator_faction" || viewerRole === "admin";
  const canEditOrgStructure   = viewerRole === "curator" || viewerRole === "curator_faction";
  const canEditAdminStructure = viewerRole === "curator" || viewerRole === "curator_admin";
  const canEditOrgCells   = viewerRole === "leader" || viewerRole === "curator" || viewerRole === "curator_faction";
  const canEditAdminCells = viewerRole === "curator" || viewerRole === "curator_admin";

  const syncPenalties = (sheet: TableSheet): TableSheet => ({
    ...sheet,
    rows: sheet.rows.map(row => {
      const nickname = row.cells[1] ?? "";
      const player = players.find(p => p.username.toLowerCase() === nickname.toLowerCase());
      if (!player) return row;
      const verbal    = player.penalties.filter(p => p.type === "verbal"    && p.isActive).length;
      const reprimand = player.penalties.filter(p => p.type === "reprimand" && p.isActive).length;
      return {
        ...row,
        cells: {
          ...row.cells,
          [COL_ID_VERBAL]:    String(verbal),
          [COL_ID_REPRIMAND]: String(reprimand),
        },
      };
    }),
  });

  const orgTableSynced   = syncPenalties(orgTable);
  const adminTableSynced = syncPenalties(adminTable);

  return (
    <div className="space-y-5 animate-fade-in">
      {canSeeOrg && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Building2" size={13} className="text-violet-400" />
            <span className="font-hud text-sm tracking-wider text-purple-400">ТАБЛИЦА ОРГАНИЗАЦИИ</span>
            {myOrg && <span className="rank-badge text-[9px] font-hud px-2 py-0.5 text-violet-300/70">{myOrg.name}</span>}
            {!canEditOrgCells && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-mono-hud text-purple-800">
                <Icon name="Eye" size={10} /> только просмотр
              </span>
            )}
          </div>
          <HudTable
            sheet={orgTableSynced}
            canEditCells={canEditOrgCells}
            canEditStructure={canEditOrgStructure}
            onChange={onOrgTableChange}
          />
        </div>
      )}

      {canSeeAdmin && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ShieldCheck" size={13} className="text-pink-400" />
            <span className="font-hud text-sm tracking-wider text-purple-400">ТАБЛИЦА АДМИНИСТРАЦИИ</span>
            {!canEditAdminCells && (
              <span className="ml-auto flex items-center gap-1 text-[10px] font-mono-hud text-purple-800">
                <Icon name="Eye" size={10} /> только просмотр
              </span>
            )}
          </div>
          <HudTable
            sheet={adminTableSynced}
            canEditCells={canEditAdminCells}
            canEditStructure={canEditAdminStructure}
            onChange={onAdminTableChange}
          />
        </div>
      )}

      {!canSeeOrg && !canSeeAdmin && (
        <div className="hud-panel p-10 text-center font-mono-hud text-xs text-purple-800">
          Нет доступа к таблицам
        </div>
      )}
    </div>
  );
}
