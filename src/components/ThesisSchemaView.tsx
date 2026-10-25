import React, { useState } from 'react';
import {
  Database,
  GitBranch,
  GraduationCap,
  FileText,
  Table2,
  ExternalLink,
} from 'lucide-react';
import {
  THESIS_METADATA,
  DATABASE_DICTIONARY_DOCS,
} from '../data/seedData.ts';

interface ThesisSchemaViewProps {
  tableCounts: Record<string, number>;
}

export const ThesisSchemaView: React.FC<ThesisSchemaViewProps> = ({
  tableCounts,
}) => {
  const [selectedTable, setSelectedTable] = useState<string>('tbl_users');

  const activeDoc =
    DATABASE_DICTIONARY_DOCS.find((t) => t.tableName === selectedTable) ||
    DATABASE_DICTIONARY_DOCS[0];

  return (
    <div className="space-y-8">
      {/* Thesis Cover Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-semibold text-amber-700">
              {THESIS_METADATA.universityKh} · {THESIS_METADATA.universityEn}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              សារណាបទស្រាវជ្រាវ៖ {THESIS_METADATA.topicKh}
            </h1>
            <p className="text-sm text-slate-600">
              {THESIS_METADATA.facultyKh} · ជំនាញ {THESIS_METADATA.majorKh} · {THESIS_METADATA.generation} · ឆ្នាំសិក្សា {THESIS_METADATA.academicYear}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="/assets/aistudio/____________________________Chapter_3_000a8cbe.pdf"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors whitespace-nowrap"
            >
              <FileText className="w-4 h-4 text-amber-700" />
              <span>បើកមើលឯកសារសារណាដើម (PDF)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Authors & Committee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>គណៈកម្មការដឹកនាំ និងរៀបរៀងសារណាបទ (និស្សិតជំនាន់ទី១២)</span>
            </h2>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {THESIS_METADATA.students.map((st, idx) => (
                <div
                  key={st.code}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {idx + 1}. {st.nameKh}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({st.nameEn})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">{st.role}</div>
                  </div>
                  <div className="font-mono-tabular text-xs font-semibold text-slate-700">
                    អត្តលេខ៖ {st.id}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3">
              សាស្ត្រាចារ្យដឹកនាំ និងគណៈកម្មការវាយតម្លៃសារណាបទ
            </h2>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {THESIS_METADATA.committee.map((cm) => (
                <div
                  key={cm.nameEn}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <div className="font-bold text-slate-900">{cm.nameKh}</div>
                    <div className="text-xs text-slate-500">{cm.nameEn}</div>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {cm.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3.2.3 - 3.2.5: Interactive Database Schema & Data Dictionary */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-semibold text-amber-700">
            CHAPTER 3 · SECTION 3.2.3 – 3.2.5 DATABASE SCHEMA & DATA DICTIONARY
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            រចនាសម្ព័ន្ធតារាងទិន្នន័យទាំង ៨ ក្នុងប្រព័ន្ធ (Relational Database Tables)
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            ចុចលើឈ្មោះតារាងនីមួយៗខាងក្រោម ដើម្បីពិនិត្យមើល Data Dictionary (Field Name, Data Type, Primary/Foreign Key Constraints)៖
          </p>
        </div>

        {/* 8 Table Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {DATABASE_DICTIONARY_DOCS.map((t) => {
            const isSelected = t.tableName === selectedTable;
            const count = tableCounts[t.tableName] ?? 0;
            return (
              <button
                key={t.tableName}
                type="button"
                onClick={() => setSelectedTable(t.tableName)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Table2 className="w-4 h-4 opacity-80" />
                  <span className="text-xs font-mono-tabular opacity-80">
                    {count} rows
                  </span>
                </div>
                <div className="font-mono-tabular text-xs font-bold mt-1.5 truncate">
                  {t.tableName}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Table Data Dictionary */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <span className="font-mono-tabular text-sm font-bold text-slate-900">
                {activeDoc.tableName}
              </span>
              <span className="text-xs text-slate-500 ml-2">
                — {activeDoc.descriptionKh}
              </span>
            </div>
            <span className="text-xs font-mono-tabular font-semibold text-amber-700">
              ទិន្នន័យកំពុងដំណើរការ៖ {tableCounts[activeDoc.tableName] ?? 0} Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-600">
                  <th className="py-3 px-4">ឈ្មោះ Field (Column)</th>
                  <th className="py-3 px-4">ប្រភេទទិន្នន័យ (Data Type)</th>
                  <th className="py-3 px-4">លក្ខខណ្ឌកំហិត (Constraints / Keys)</th>
                  <th className="py-3 px-4">ការពិពណ៌នា (Description)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {activeDoc.fields.map((f) => (
                  <tr key={f.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono-tabular font-bold text-slate-900">
                      {f.name}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-xs text-amber-700">
                      {f.type}
                    </td>
                    <td className="py-3 px-4 font-mono-tabular text-xs text-slate-600">
                      {f.constraint}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{f.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 3.2.6 & 3.2.7: DFD Level 0 / Level 1 & ER Relationships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <GitBranch className="w-4 h-4" />
            <span>SECTION 3.2.6 · DATA FLOW DIAGRAM (DFD LEVEL 0 & LEVEL 1)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            ដំណើរការហូរទិន្នន័យធំៗទាំង ៥ ក្នុងប្រព័ន្ធ (5 Core Processes)
          </h3>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-sm">
            <div className="p-3.5">
              <div className="font-bold text-slate-900">
                Process 1.0: ការផ្ទៀងផ្ទាត់គណនី (User Authentication)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                ផ្ទៀងផ្ទាត់សិទ្ធិអ្នកប្រើប្រាស់ (Staff, Admin, Restaurant Partner) និងការបម្លែងកូដសម្ងាត់ Password Encryption ក្នុង tbl_users។
              </p>
            </div>
            <div className="p-3.5">
              <div className="font-bold text-slate-900">
                Process 2.0: ការគ្រប់គ្រងម៉ោង Cut-off (Time Window Management)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Admin កំណត់ចន្លោះម៉ោងបើក និងបិទទទួលការកម្ម៉ង់ដោយស្វ័យប្រវត្តិ (ឧ. 08:00 ដល់ 10:30 ព្រឹក) ក្នុង tbl_time_windows។
              </p>
            </div>
            <div className="p-3.5">
              <div className="font-bold text-slate-900">
                Process 3.0: ការចាត់ចែងការបញ្ជាទិញ (Order Processing)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                បុគ្គលិកជ្រើសរើសមុខម្ហូប គណនាតម្លៃសរុប ទូទាត់ប្រាក់តាម KHQR និងរក្សាទុកចូល tbl_orders និង tbl_order_details។
              </p>
            </div>
            <div className="p-3.5">
              <div className="font-bold text-slate-900">
                Process 4.0: ការបូកសរុបបញ្ជីរួម (Batch Order Consolidation)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                បូកសរុបបរិមាណមុខម្ហូបទាំងអស់តាមភោជនីយដ្ឋានដៃគូចូលក្នុង tbl_batch_orders ដើម្បីបង្ហាញលើអេក្រង់ KDS ផ្ទះបាយ។
              </p>
            </div>
            <div className="p-3.5">
              <div className="font-bold text-slate-900">
                Process 5.0: ការបង្កើតរបាយការណ៍សរុប (Report Generation)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                ផលិតរបាយការណ៍ចំណាយប្រចាំថ្ងៃ ប្រចាំសប្តាហ៍ និងប្រចាំខែ តាមផ្នែក/មហាវិទ្យាល័យសម្រាប់ផ្នែករដ្ឋបាល។
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
            <Database className="w-4 h-4" />
            <span>SECTION 3.2.7 · DATA RELATIONSHIP (ER-DIAGRAM 1-TO-MANY)</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            ទំនាក់ទំនងរវាងតារាងទិន្នន័យ (Entity Relationships)
          </h3>
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-sm">
            <div className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-mono-tabular font-bold text-slate-900">
                  tbl_users (1) ───► (N) tbl_orders
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  បុគ្គលិកម្នាក់អាចធ្វើការបញ្ជាទិញអាហារបានច្រើនលើកតាមថ្ងៃខុសៗគ្នា។
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                1-to-Many
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-mono-tabular font-bold text-slate-900">
                  tbl_orders (1) ───► (N) tbl_order_details
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  វិក្កយបត្របញ្ជាទិញមួយលើកអាចមានមុខម្ហូប និងភេសជ្ជៈច្រើនមុខ។
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                1-to-Many
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-mono-tabular font-bold text-slate-900">
                  tbl_menu_items (1) ───► (N) tbl_order_details
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  មុខម្ហូបមួយមុខអាចស្ថិតនៅក្នុងការកម្ម៉ង់របស់បុគ្គលិកជាច្រើននាក់។
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                1-to-Many
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-mono-tabular font-bold text-slate-900">
                  tbl_time_windows (1) ───► (N) tbl_orders & tbl_batch_orders
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  ចន្លោះម៉ោង Cut-off មួយអាចទទួលការកម្ម៉ង់ច្រើន និងបង្កើតបញ្ជីរួមតាមភោជនីយដ្ឋាន។
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                1-to-Many
              </span>
            </div>

            <div className="p-3.5 flex items-center justify-between">
              <div>
                <div className="font-mono-tabular font-bold text-slate-900">
                  tbl_restaurants (1) ───► (N) tbl_menu_items
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  ភោជនីយដ្ឋានដៃគូមួយអាចផ្គត់ផ្គង់មុខម្ហូបបានច្រើនមុខក្នុងប្រព័ន្ធ។
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-semibold text-slate-500">
                1-to-Many
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
