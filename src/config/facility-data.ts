export type SystemId = string;

export interface FloorData {
    id: string;
    label: string;
    systems: SystemId[];
}

export interface BlockData {
    id: string;
    label: string;
    floors: FloorData[];
}

export const FACILITY_STRUCTURE: BlockData[] = [
    {
        id: "production",
        label: "Production Block",
        floors: [
            {
                id: "gf",
                label: "Ground Floor",
                systems: [
                    "AHU-GF-01",
                    "AHU-GF-04", "AHU-GF-05", "AHU-GF-06", "AHU-GF-07", "AHU-GF-08", "AHU-GF-09", "AHU-GF-10", "AHU-GF-11",
                    "AHU-GF-13", "AHU-GF-14", "AHU-GF-15", "AHU-GF-16", "AHU-GF-17", "AHU-GF-18", "AHU-GF-19", "AHU-GF-20",
                    "ACD-GF-01"
                ]
            },
            {
                id: "ff",
                label: "First Floor",
                systems: [
                    "AHU-FF-03", "AHU-FF-04", "AHU-FF-05", "AHU-FF-06", "AHU-FF-07",
                    "AHU-FF-08", "AHU-FF-09", "AHU-FF-10", "AHU-FF-11", "AHU-FF-12"
                ]
            },
            {
                id: "sf",
                label: "Second Floor",
                systems: [
                    "AHU-SF-01", "AHU-SF-02", "AHU-SF-03", "AHU-SF-04", "AHU-SF-05",
                    "AHU-SF-06", "AHU-SF-07", "AHU-SF-08", "AHU-SF-09", "AHU-SF-10"
                ]
            }
        ]
    },
    {
        id: "warehouse",
        label: "Warehouse Block",
        floors: [
            {
                id: "gf",
                label: "Ground Floor",
                systems: ["AHU-GF-02"]
            },
            {
                id: "ff",
                label: "First Floor",
                systems: ["Switch Panel (Monitoring Only)"]
            }
        ]
    }
];

export const ALL_SYSTEMS = FACILITY_STRUCTURE.flatMap(b => b.floors.flatMap(f => f.systems));
