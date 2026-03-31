package com.warehouse.ops.config;

import com.warehouse.ops.entity.*;
import com.warehouse.ops.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.*;

/**
 * Seeds demo data into the H2 in-memory database when running with the "dev" profile.
 * Mirrors the data in supabase/migrations/002_seed.sql.
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final UserRepository userRepo;
    private final LocationRepository locationRepo;
    private final CategoryRepository categoryRepo;
    private final InventoryItemRepository itemRepo;
    private final TicketRepository ticketRepo;
    private final DiscrepancyDetailRepository discrepancyRepo;
    private final InventoryAdjustmentRepository adjustmentRepo;
    private final NoteRepository noteRepo;
    private final AuditLogRepository auditRepo;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("=== Seeding demo data (dev profile) ===");

        // --- Roles ---
        Role admin     = role("Admin",              "Full system access");
        Role opsManager= role("OpsManager",         "Operations manager with dashboard and reports");
        Role supervisor= role("Supervisor",          "Floor supervisor with review queue access");
        Role associate = role("WarehouseAssociate",  "Associate who reports issues");

        // --- Users ---
        User uAdmin  = user("Alex Turner",    "admin@warehouse.demo",       admin);
        User uOps    = user("Sarah Johnson",  "ops@warehouse.demo",         opsManager);
        User uSup    = user("Mike Rivera",    "supervisor@warehouse.demo",  supervisor);
        User uSup2   = user("Jordan Lee",     "supervisor2@warehouse.demo", supervisor);
        User uAssoc  = user("Casey Williams", "associate@warehouse.demo",   associate);
        User uAssoc2 = user("Dana Kim",       "associate2@warehouse.demo",  associate);
        User uAssoc3 = user("Riley Morgan",   "associate3@warehouse.demo",  associate);

        // --- Locations ---
        Location locA12 = loc("WH-MAIN", "A", "A-12-04");
        Location locA15 = loc("WH-MAIN", "A", "A-15-02");
        Location locB04 = loc("WH-MAIN", "B", "B-04-07");
        Location locB09 = loc("WH-MAIN", "B", "B-09-01");
        Location locC01 = loc("WH-MAIN", "C", "C-01-03");
        Location locC08 = loc("WH-MAIN", "C", "C-08-11");
        Location locD09 = loc("WH-MAIN", "D", "D-09-05");
        Location locD03 = loc("WH-MAIN", "D", "D-03-08");
        Location locE01 = loc("WH-EAST", "E", "E-01-01");
        Location locF05 = loc("WH-EAST", "F", "F-05-03");

        // --- Categories ---
        Category catFootwear   = cat("Footwear",    "Shoes, boots, and athletic footwear");
        Category catApparel    = cat("Apparel",      "Clothing and wearable goods");
        Category catElec       = cat("Electronics",  "Electronic devices and accessories");
        Category catSports     = cat("Sports",       "Sports equipment and accessories");
        Category catHome       = cat("Home Goods",   "Household items and appliances");
        Category catPerish     = cat("Perishables",  "Food and perishable goods");

        // --- Inventory Items ---
        InventoryItem iPegasus  = item("882910-BLK", "Nike Air Zoom Pegasus",      catFootwear);
        InventoryItem iUltra    = item("773421-WHT", "Adidas Ultraboost 22",       catFootwear);
        InventoryItem iHoodie   = item("661033-NVY", "Under Armour Hoodie XL",     catApparel);
        InventoryItem iSony     = item("994712-RED", "Sony WH-1000XM5 Headphones", catElec);
        InventoryItem iWilson   = item("112834-GRN", "Wilson Tennis Racket Pro",   catSports);
        InventoryItem iInstant  = item("338829-BLU", "Instant Pot 6QT Duo",        catHome);
        InventoryItem iGranola  = item("445501-ORG", "Organic Granola Bars x24",   catPerish);
        InventoryItem iAirpods  = item("667743-SLV", "Apple AirPods Pro 2nd Gen",  catElec);
        InventoryItem iNorthFace= item("223398-BLK", "North Face Jacket L",        catApparel);
        InventoryItem iYeti     = item("889201-YLW", "Yeti Rambler 30oz Tumbler",  catHome);

        // --- Tickets ---
        Ticket t1 = ticket("EX-1001", uAssoc, uSup,   locA12, catFootwear, iPegasus,
            "Count Mismatch",  "resolved",       "high",     8,  "Stock Mismatch – Nike Air Zoom Pegasus",
            "System count 150; physical 142. Scanner #42 confirmed.", bd(840), -10, -8);

        Ticket t2 = ticket("EX-1002", uAssoc2, uSup,  locB04, catApparel,  iHoodie,
            "Damaged Goods",   "resolved",       "medium",   5,  "Damaged Hoodies – Water Damage on Box",
            "5 units with water damage in zone B.", bd(300), -9, -7);

        Ticket t3 = ticket("EX-1003", uAssoc3, uSup2, locC01, catElec,     iSony,
            "Missing Item",    "resolved",       "critical", 3,  "Missing Sony Headphones – High Value",
            "Three units missing. High value — escalated.", bd(1050), -8, -6);

        Ticket t4 = ticket("EX-1004", uAssoc,  uSup,  locA15, catFootwear, iUltra,
            "Missing Item",    "in_progress",   "high",     4,  "Missing Adidas Ultraboost Units Zone A-15",
            "Received 50 units; only 46 on shelf.", bd(480), -3, -2);

        Ticket t5 = ticket("EX-1005", uAssoc2, uSup2, locB04, catApparel,  iNorthFace,
            "Damaged Goods",   "pending_review","medium",   2,  "North Face Jacket – Torn Zipper Damage",
            "Two jackets with damaged zippers found during unloading.", bd(260), -2, -1);

        Ticket t6 = ticket("EX-1006", uAssoc3, null,  locC01, catElec,     iAirpods,
            "Count Mismatch",  "new",            "high",     12, "AirPods Pro Count Mismatch – Zone C",
            "Physical 38 vs system 50.", bd(3600), -1, -1);

        Ticket t7 = ticket("EX-1007", uAssoc,  null,  locD09, catElec,     iSony,
            "System Error",    "new",            "critical", 0,  "System Error – Scanner Offline Zone D-09",
            "Scanner offline during cycle count. Data incomplete.", bd(0), 0, 0);

        Ticket t8 = ticket("EX-1008", uAssoc2, uSup,  locB09, catHome,     iInstant,
            "Wrong Location",  "in_progress",   "low",      10, "Instant Pot Units in Wrong Zone",
            "10 units found in B-09, should be in D zone.", bd(900), -4, -3);

        Ticket t9 = ticket("EX-1009", uAssoc3, uOps,  locE01, catPerish,   iGranola,
            "Expiry Issue",    "escalated",      "critical", 48, "Granola Bars Approaching Expiry – WH-EAST",
            "48 boxes expire within 5 days.", bd(288), -1, 0);

        Ticket t10 = ticket("EX-1010", uAssoc, uSup2, locC08, catSports,   iWilson,
            "Missing Label",   "pending_review","low",      15, "Tennis Rackets Missing SKU Labels",
            "15 rackets arrived without SKU labels.", bd(1125), 0, 0);

        Ticket t11 = ticket("EX-1011", uAssoc2, uSup, locD03, catHome,     iYeti,
            "Count Mismatch",  "pending_review","medium",   7,  "Yeti Tumbler Count Discrepancy D-03",
            "System 30, physical 23.", bd(278), 0, 0);

        Ticket t12 = ticket("EX-1012", uAssoc3, null, locF05, catApparel,  iHoodie,
            "Wrong SKU",       "new",            "medium",   20, "Wrong SKU Labels on Hoodie Shipment",
            "20 hoodies labeled with wrong SKU.", bd(600), 0, 0);

        // --- Discrepancy Details ---
        DiscrepancyDetail d1 = discrepancy(t1, iPegasus, 150, 142, bd(-840));
        DiscrepancyDetail d3 = discrepancy(t3, iSony, 6, 3, bd(-1050));
        DiscrepancyDetail d4 = discrepancy(t4, iUltra, 50, 46, bd(-480));
        DiscrepancyDetail d6 = discrepancy(t6, iAirpods, 50, 38, bd(-3600));

        // --- Adjustments (for resolved tickets) ---
        adjustment(d1, uSup,  "approved", "Recount confirmed. Loss recorded.", "ADJ-SHRINK-001", bd(-840), -7);
        adjustment(d3, uOps,  "approved", "Security confirmed theft. Write-off approved.", "ADJ-LOSS-002", bd(-1050), -5);

        // --- Notes ---
        note(t1, uAssoc,  "Recounted twice. Box damaged and empty. Marked as loss.",         -9, 14);
        note(t1, uSup,    "Scanner #42 verified. Proceeding with adjustment.",               -9, 2);
        note(t1, uOps,    "Escalated for financial approval. Value exceeds $500 threshold.", -8, 10);
        note(t4, uAssoc,  "Checked receiving manifest — only 46 units signed off by carrier.", -2, 20);
        note(t4, uSup,    "Filed claim with carrier. Response expected in 48 hours.",         -2, 8);
        note(t6, uAssoc3, "Checked adjacent bins. Could not locate missing units.",           0, -20);
        note(t9, uAssoc3, "Flagged for immediate disposal coordination.",                     0, -4);
        note(t9, uOps,    "Arranged emergency transfer to store receiving.",                  0, -2);

        // --- Audit Logs ---
        auditLog(t1,  uAssoc,  "TICKET_CREATED",      "Ticket EX-1001 created",               -10, 0);
        auditLog(t1,  uSup,    "TICKET_ASSIGNED",      "Assigned to Mike Rivera",              -9, 23);
        auditLog(t1,  uSup,    "STATUS_CHANGED",       "new → pending_review",                 -9, 20);
        auditLog(t1,  uSup,    "STATUS_CHANGED",       "pending_review → in_progress",         -9, 10);
        auditLog(t1,  uOps,    "TICKET_ESCALATED",     "Escalated for financial approval",      -8, 10);
        auditLog(t1,  uOps,    "ADJUSTMENT_APPROVED",  "ADJ-SHRINK-001 approved. Impact -$840", -7, 0);
        auditLog(t1,  uSup,    "TICKET_RESOLVED",      "Ticket resolved",                      -8, 0);
        auditLog(t4,  uAssoc,  "TICKET_CREATED",       "Ticket EX-1004 created",               -3, 0);
        auditLog(t4,  uSup,    "TICKET_ASSIGNED",      "Assigned to Mike Rivera",              -2, 22);
        auditLog(t4,  uSup,    "STATUS_CHANGED",       "new → in_progress",                    -2, 20);
        auditLog(t6,  uAssoc3, "TICKET_CREATED",       "Ticket EX-1006 created",               -1, 0);
        auditLog(t7,  uAssoc,  "TICKET_CREATED",       "Ticket EX-1007 created. CRITICAL priority auto-assigned.", 0, -6);
        auditLog(t9,  uAssoc3, "TICKET_CREATED",       "Ticket EX-1009 created",               -1, 0);
        auditLog(t9,  uOps,    "TICKET_ASSIGNED",      "Assigned to Sarah Johnson",            -22, 0);
        auditLog(t9,  uOps,    "TICKET_ESCALATED",     "Perishables require immediate action", -5, 0);
        auditLog(t12, uAssoc3, "TICKET_CREATED",       "Ticket EX-1012 created",               -1, 0);

        log.info("=== Demo data seeded: {} tickets, {} users, {} items ===",
            ticketRepo.count(), userRepo.count(), itemRepo.count());
    }

    // ─── helper builders ────────────────────────────────────────────────────

    private Role role(String name, String desc) {
        Role r = new Role(); r.setName(name); r.setDescription(desc);
        return roleRepo.save(r);
    }

    private User user(String name, String email, Role role) {
        User u = new User(); u.setFullName(name); u.setEmail(email);
        u.setRole(role); u.setStatus("active");
        return userRepo.save(u);
    }

    private Location loc(String warehouse, String zone, String bin) {
        Location l = new Location(); l.setWarehouse(warehouse); l.setZone(zone);
        l.setBin(bin); l.setStatus("active");
        return locationRepo.save(l);
    }

    private Category cat(String name, String desc) {
        Category c = new Category(); c.setCategoryName(name); c.setDescription(desc);
        return categoryRepo.save(c);
    }

    private InventoryItem item(String sku, String name, Category cat) {
        InventoryItem i = new InventoryItem(); i.setSku(sku); i.setItemName(name);
        i.setCategory(cat);
        return itemRepo.save(i);
    }

    private Ticket ticket(String num, User creator, User assignee, Location loc,
                          Category cat, InventoryItem item, String type, String status,
                          String priority, int qty, String title, String desc,
                          BigDecimal value, int daysAgoCreated, int daysAgoUpdated) {
        Ticket t = new Ticket();
        t.setTicketNumber(num);
        t.setCreatedBy(creator);
        t.setAssignedTo(assignee);
        t.setLocation(loc);
        t.setCategory(cat);
        t.setInventoryItem(item);
        t.setTicketType(type);
        t.setStatus(status);
        t.setPriority(priority);
        t.setQuantity(qty);
        t.setTitle(title);
        t.setDescription(desc);
        t.setEstimatedValueImpact(value);
        t.setCreatedAt(OffsetDateTime.now().plusDays(daysAgoCreated));
        t.setUpdatedAt(OffsetDateTime.now().plusDays(daysAgoUpdated));
        if ("resolved".equals(status) || "closed".equals(status))
            t.setClosedAt(OffsetDateTime.now().plusDays(daysAgoUpdated));
        return ticketRepo.save(t);
    }

    private DiscrepancyDetail discrepancy(Ticket t, InventoryItem item, int expected, int actual, BigDecimal varValue) {
        DiscrepancyDetail d = new DiscrepancyDetail();
        d.setTicket(t); d.setItem(item);
        d.setExpectedQty(expected); d.setActualQty(actual);
        d.setVariance(actual - expected);
        d.setVarianceValue(varValue);
        return discrepancyRepo.save(d);
    }

    private void adjustment(DiscrepancyDetail d, User approver, String decision,
                            String justification, String code, BigDecimal impact, int daysAgo) {
        InventoryAdjustment adj = new InventoryAdjustment();
        adj.setDiscrepancy(d);
        adj.setApprovedBy(approver);
        adj.setDecision(decision);
        adj.setJustification(justification);
        adj.setAdjustmentCode(code);
        adj.setFinancialImpact(impact);
        adj.setApprovedAt(OffsetDateTime.now().plusDays(daysAgo));
        adjustmentRepo.save(adj);
    }

    private void note(Ticket t, User u, String text, int daysAgo, int hoursAgo) {
        Note n = new Note(); n.setTicket(t); n.setUser(u); n.setNoteText(text);
        n.setCreatedAt(OffsetDateTime.now().plusDays(daysAgo).minusHours(hoursAgo));
        noteRepo.save(n);
    }

    private void auditLog(Ticket t, User u, String action, String details, int daysAgo, int hoursAgo) {
        AuditLog a = new AuditLog(); a.setTicket(t); a.setUser(u);
        a.setAction(action); a.setDetails(details);
        a.setTimestamp(OffsetDateTime.now().plusDays(daysAgo).minusHours(Math.abs(hoursAgo)));
        auditRepo.save(a);
    }

    private BigDecimal bd(double v) { return BigDecimal.valueOf(v); }
}
