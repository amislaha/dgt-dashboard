/**
 * Shared shape for the header nav's "Master Data"/"Settings" lookup entities that have no defined
 * fields of their own yet (Wilayah Status, Project, Strategic Target, Recommendation Category,
 * Profil Group, Application Settings, Approval Flow, etc. — see entity-configs.ts). One interface
 * for all of them, unlike Wpt/Skp/Sp/etc., since every one of these is currently just a name +
 * optional description placeholder pending real field requirements (see PORT_NOTES.md).
 */
export interface SimpleMaster {
  id: string;
  nama: string;
  keterangan?: string;
}
