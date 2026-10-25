import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, UserCheck, UtensilsCrossed } from 'lucide-react';
import type { TblUser, UserRole } from '../types/database.ts';
import { verifyUserCredentials, encryptPassword } from '../utils/orderingLogic.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: TblUser[];
  currentUser: TblUser;
  onSelectUser: (user: TblUser) => void;
  onRegisterUser: (newUser: TblUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'switch' | 'login' | 'register'>('switch');
  const [identifier, setIdentifier] = useState('02712');
  const [password, setPassword] = useState('diu2026');
  const [errorMsg, setErrorMsg] = useState('');

  // Registration fields
  const [regNameKh, setRegNameKh] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('ព័ត៌មានវិទ្យា (IT Department)');
  const [regRole, setRegRole] = useState<UserRole>('Staff');
  const [regPass, setRegPass] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('សូមបញ្ចូលអត្តលេខ/អ៊ីមែល និងពាក្យសម្ងាត់ឱ្យបានត្រឹមត្រូវ។');
      return;
    }
    const matched = verifyUserCredentials(users, identifier, password);
    if (!matched) {
      setErrorMsg('អត្តលេខ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ (សាកល្បង៖ 02712 ឬ 02699 / ពាក្យសម្ងាត់៖ diu2026)។');
      return;
    }
    onSelectUser(matched);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regNameKh.trim() || !regCode.trim() || !regEmail.trim() || !regPass.trim()) {
      setErrorMsg('សូមបំពេញព័ត៌មានចាំបាច់ទាំងអស់ដើម្បីចុះឈ្មោះគណនីថ្មី។');
      return;
    }
    const exists = users.some(
      (u) =>
        u.email.toLowerCase() === regEmail.trim().toLowerCase() ||
        u.student_or_staff_code.toLowerCase() === regCode.trim().toLowerCase()
    );
    if (exists) {
      setErrorMsg('អត្តលេខ ឬអ៊ីមែលនេះមានក្នុងប្រព័ន្ធរួចហើយ។');
      return;
    }

    const nextId = users.reduce((max, u) => Math.max(max, u.user_id), 0) + 1;
    const created: TblUser = {
      user_id: nextId,
      student_or_staff_code: regCode.trim(),
      full_name: regNameKh.trim(),
      full_name_en: regNameKh.trim(),
      email: regEmail.trim(),
      password_hash: encryptPassword(regPass),
      role: regRole,
      department: regDept,
      phone: '012 000 111',
      created_at: new Date().toISOString(),
    };
    onRegisterUser(created);
    onSelectUser(created);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div>
            <h2 id="auth-modal-title" className="text-lg font-bold text-slate-900">
              គណនីអ្នកប្រើប្រាស់ និងសិទ្ធិប្រព័ន្ធ (User Authentication)
            </h2>
            <p className="text-xs text-slate-600">
              តារាង tbl_users · សាកលវិទ្យាល័យអន្តរជាតិ ឌូវី (DIU)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="បិទផ្ទាំងគណនី"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Segmented Control */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setMode('switch');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                mode === 'switch'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ប្តូរគណនីរហ័ស (Demo Roles)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ចូលប្រើប្រាស់ (Login)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ចុះឈ្មោះថ្មី (Register)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-800">
              {errorMsg}
            </div>
          )}

          {mode === 'switch' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                ជ្រើសរើសគណនីនិស្សិតស្រាវជ្រាវ សាស្ត្រាចារ្យ ឬផ្ទះបាយ ដើម្បីធ្វើតេស្តមុខងារតាមតួនាទីនីមួយៗ (Use-Case Mapping)៖
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg max-h-80 overflow-y-auto">
                {users.map((u) => {
                  const isCurrent = u.user_id === currentUser.user_id;
                  return (
                    <button
                      key={u.user_id}
                      type="button"
                      onClick={() => {
                        onSelectUser(u);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                        isCurrent ? 'bg-amber-50/80' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono-tabular text-xs font-bold shrink-0">
                          {u.role === 'Admin' ? (
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                          ) : u.role === 'Restaurant' ? (
                            <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-sky-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {u.full_name}{' '}
                            <span className="text-xs font-normal text-slate-500">
                              ({u.full_name_en})
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono-tabular">
                            ID: {u.student_or_staff_code} · តួនាទី: {u.role} · {u.department}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-amber-700 whitespace-nowrap ml-2">
                        {isCurrent ? 'កំពុងប្រើប្រាស់' : 'ជ្រើសរើស →'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  អត្តលេខបុគ្គលិក/និស្សិត ឬ អ៊ីមែល (Staff ID / Email)
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="ឧ. 02712, 02699, 02657 ឬ sopheaknetra@diu.edu.kh"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  ពាក្យសម្ងាត់ (Password - លំនាំដើម៖ diu2026)
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="បញ្ចូលពាក្យសម្ងាត់..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ផ្ទៀងផ្ទាត់ និងចូលប្រព័ន្ធ</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-name"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    ឈ្មោះពេញ (Full Name)
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={regNameKh}
                    onChange={(e) => setRegNameKh(e.target.value)}
                    placeholder="ឧ. ចាន់ តារា"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-code"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    អត្តលេខ (Staff / Student ID)
                  </label>
                  <input
                    id="reg-code"
                    type="text"
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value)}
                    placeholder="ឧ. 02801"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono-tabular"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    អ៊ីមែល (Email)
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="dara@diu.edu.kh"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-role"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    តួនាទីក្នុងប្រព័ន្ធ (Role)
                  </label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  >
                    <option value="Staff">Staff (បុគ្គលិកកម្ម៉ង់អាហារ)</option>
                    <option value="Admin">Admin (អ្នកគ្រប់គ្រងប្រព័ន្ធ)</option>
                    <option value="Restaurant">Restaurant (ផ្ទះបាយ KDS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-dept"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    ផ្នែក ឬមហាវិទ្យាល័យ (Department)
                  </label>
                  <input
                    id="reg-dept"
                    type="text"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-pass"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    ពាក្យសម្ងាត់ (Password)
                  </label>
                  <input
                    id="reg-pass"
                    type="password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="បញ្ចូលពាក្យសម្ងាត់..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>បង្កើតគណនីថ្មីក្នុង tbl_users</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
