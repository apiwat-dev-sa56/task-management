'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  Sliders, 
  Calendar, 
  User, 
  Folder, 
  Tag, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Grid, 
  HelpCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  Archive,
  RefreshCw,
  Info,
  Table
} from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

// Configure dayjs Thai locale globally
if (typeof window !== 'undefined') {
  dayjs.locale('th');
}

// Define Task Structure
interface Task {
  id: string;
  title: string;
  project: string;
  category: string;
  assignee: string;
  startDate: string;
  startTime?: string;
  dueDate: string;
  dueTime?: string;
  isImportant: boolean; // สำคัญ
  isUrgent: boolean;    // เร่งด่วน
  status: 'not-started' | 'in-progress' | 'review' | 'completed' | 'revising' | 'disapproved';
  progress: number;     // 0 - 100
  notes?: string;
  createdAt: string;
}

// Generate dynamic relative dates so the preview is always evergreen and accurate
const getRelativeDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

// Initial/default seed tasks to showcase countdowns, matrices, and bottlenecks with zero setup
const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-ref-1',
    title: 'ออกแบบแพคเกจจิ้งร้านคุกกี้',
    project: 'Project K',
    category: 'Design',
    assignee: 'ธนพล',
    startDate: getRelativeDateStr(-2),
    dueDate: getRelativeDateStr(0), // Today
    isImportant: true,
    isUrgent: false,
    status: 'revising',
    progress: 85, // will trigger "แก้ไข" 🚀 status indicator badge
    notes: 'เน้นสีสันที่สบายตา อิงตามสไตล์มินิมอล มีสเปซโปร่งสบาย โล่งตา',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-2',
    title: 'ติดต่อเช่าสถานที่จัดงานอีเวนต์',
    project: 'Project E',
    category: 'Operations',
    assignee: 'นภา',
    startDate: getRelativeDateStr(-4),
    dueDate: getRelativeDateStr(0), // Today
    isImportant: true,
    isUrgent: true,
    status: 'in-progress',
    progress: 55, // will trigger "กำลังทำ" ⏳ badge
    notes: 'ติดต่อทางโรงแรมในเครือข่าย เพื่อขอใบเสนอราคาจัดนิทรรศการวิชาการ',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-3',
    title: 'ปรับเส้นทางการส่งสินค้าลดต้นทุน',
    project: 'Project G',
    category: 'Operations',
    assignee: 'วิภาดา',
    startDate: getRelativeDateStr(-1),
    dueDate: getRelativeDateStr(0), // Today
    isImportant: false,
    isUrgent: false,
    status: 'disapproved',
    progress: 30, // Custom progress to trigger "ไม่อนุมัติ" ❌
    notes: 'วิเคราะห์ข้อมูลการจัดส่งและประเมินงบประมาณทางเลือกใหม่',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-4',
    title: 'เขียนสคริปต์วีดีโอรีวิวสินค้าใหม่',
    project: 'Project B',
    category: 'Development',
    assignee: 'ธนพล',
    startDate: getRelativeDateStr(0),
    dueDate: getRelativeDateStr(1), // Tomorrow
    isImportant: true,
    isUrgent: true,
    status: 'not-started',
    progress: 0, // will trigger "ยังไม่เริ่ม" 🕒
    notes: 'สคริปต์โฆษณาความยาว 60 วินาที เจาะกลุ่มวัยทำงานและผู้รักสุขภาพ',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-5',
    title: 'ทำแบบทดสอบประเมินผลหลังการอบรม',
    project: 'Project J',
    category: 'Research',
    assignee: 'นภา',
    startDate: getRelativeDateStr(-6),
    dueDate: getRelativeDateStr(1), // Tomorrow
    isImportant: false,
    isUrgent: false,
    status: 'in-progress',
    progress: 50,
    notes: 'ทำแบบประเมินผู้ใช้เพื่อปรับปรุงรูปแบบเนื้อหาและการบรรยายครั้งหน้า',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-6',
    title: 'นัดหมายวางระบบและทดสอบระบบภายใน',
    project: 'Project D',
    category: 'Development',
    assignee: 'มณีรัตน์',
    startDate: getRelativeDateStr(-3),
    dueDate: getRelativeDateStr(2), // In 2 Days
    isImportant: true,
    isUrgent: true,
    status: 'review',
    progress: 75, // will trigger "ตรวจสอบ" 👀
    notes: 'ตั้งค่าเซิร์ฟเวอร์สำรองข้อมูลและทดสอบความทนทานต่อการขยายตัว',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-7',
    title: 'จัดทำคู่มือประกอบผลิตภัณฑ์ใหม่',
    project: 'Project A',
    category: 'Development',
    assignee: 'วิภาดา',
    startDate: getRelativeDateStr(-8),
    dueDate: getRelativeDateStr(-2), // Overdue!
    isImportant: false,
    isUrgent: true,
    status: 'not-started',
    progress: 0,
    notes: 'เรียบเรียงเนื้อหาแปลไทยและตรวจสอบความสมบูรณ์ทางการผลิต',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-8',
    title: 'สำรวจความพึงพอใจของลูกค้าหลังบริการ',
    project: 'Project K',
    category: 'Marketing',
    assignee: 'วิภาดา',
    startDate: getRelativeDateStr(-5),
    dueDate: getRelativeDateStr(-4), // Overdue!
    isImportant: false,
    isUrgent: false,
    status: 'not-started',
    progress: 0,
    notes: 'ส่งแบบสอบถามสั้นผ่านอีเมลเพื่อเก็บคะแนนคะแนน NPS ประจำรอบ',
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-ref-9',
    title: 'ปรับปรุงแอปพลิเคชันระบบจัดการงานจัดบอร์ด',
    project: 'Project G',
    category: 'General',
    assignee: 'Apiwat (Developer)',
    startDate: getRelativeDateStr(-7),
    dueDate: getRelativeDateStr(-3),
    isImportant: false,
    isUrgent: false,
    status: 'completed',
    progress: 100,
    notes: 'สรุปการใช้งานและรายงานผลความเร็วหลังปรับโครงสร้างข้อมูล',
    createdAt: new Date().toISOString()
  }
];

// --- THAI BUDDHIST ERA UTILITIES & COMPONENT ---

const getBuddhistYear = (date: Date | string | dayjs.Dayjs) => {
  return dayjs(date).year() + 543;
};

const formatThaiBuddhistDate = (dateStr: string, timeStr?: string) => {
  if (!dateStr) return 'ไม่ได้ระบุ';
  const d = dayjs(dateStr);
  if (!d.isValid()) return dateStr;
  
  const thaiMonthsShort = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  
  const day = d.date();
  const monthIdx = d.month();
  const yearBE = d.year() + 543;
  
  let formatted = `${day} ${thaiMonthsShort[monthIdx]} ${yearBE}`;
  if (timeStr && timeStr.trim() !== '') {
    formatted += ` (${timeStr} น.)`;
  }
  return formatted;
};

interface THDateTimePickerProps {
  label: string;
  dateValue: string; // YYYY-MM-DD
  timeValue: string; // HH:mm
  onChange: (date: string, time: string) => void;
  isDue?: boolean;
}

function THDateTimePicker({
  label,
  dateValue,
  timeValue,
  onChange,
  isDue = false
}: THDateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs(dateValue || undefined));
  
  // Format the visual display in Thai & Buddhist Era
  const displayFormatted = () => {
    if (!dateValue) return 'เลือกวันและเวลา';
    const d = dayjs(dateValue);
    if (!d.isValid()) return dateValue;
    
    const thaiDays = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const thaiMonthsShort = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    
    const dayOfWeek = thaiDays[d.day()];
    const dayNum = d.date();
    const monthStr = thaiMonthsShort[d.month()];
    const yearBE = d.year() + 543;
    
    return `${dayOfWeek}ที่ ${dayNum} ${monthStr} ${yearBE} - ${timeValue || '09:00'} น.`;
  };

  // Pre-calculate Calendar grid
  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');
  const totalDaysInMonth = currentMonth.daysInMonth();
  const startDayOfWeek = startOfMonth.day(); // 0-6 (Sun-Sat)

  const prevMonth = currentMonth.subtract(1, 'month');
  const prevDaysInMonth = prevMonth.daysInMonth();
  const prevMonthCells = [];
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevDaysInMonth - i;
    const partialDate = prevMonth.date(day);
    prevMonthCells.push({
      dateStr: partialDate.format('YYYY-MM-DD'),
      dayNum: day,
      isCurrentMonth: false,
    });
  }

  const currentMonthCells = [];
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const partialDate = currentMonth.date(i);
    currentMonthCells.push({
      dateStr: partialDate.format('YYYY-MM-DD'),
      dayNum: i,
      isCurrentMonth: true,
    });
  }

  const totalCells = prevMonthCells.length + currentMonthCells.length;
  const nextMonthCellsNeeded = 42 - totalCells;
  const nextMonth = currentMonth.add(1, 'month');
  const nextMonthCells = [];
  for (let i = 1; i <= nextMonthCellsNeeded; i++) {
    const partialDate = nextMonth.date(i);
    nextMonthCells.push({
      dateStr: partialDate.format('YYYY-MM-DD'),
      dayNum: i,
      isCurrentMonth: false,
    });
  }

  const allCells = [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];

  const THAI_MONTH_NAMES = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // Year choices
  const currentYear = dayjs().year();
  const yearsRange = Array.from({ length: 41 }, (_, i) => currentYear - 20 + i);

  const handleDayClick = (dateStr: string) => {
    onChange(dateStr, timeValue);
  };

  const handleTimeChange = (type: 'hour' | 'minute', val: string) => {
    const [h, m] = (timeValue || '09:00').split(':');
    let nextTime = '';
    if (type === 'hour') {
      nextTime = `${val}:${m}`;
    } else {
      nextTime = `${h}:${val}`;
    }
    onChange(dateValue, nextTime);
  };

  const handlePresetTime = (presetTime: string) => {
    onChange(dateValue, presetTime);
  };

  // Date shortcuts
  const handleShortcut = (type: 'today' | 'tomorrow' | 'next-week') => {
    let target = dayjs();
    if (type === 'tomorrow') target = dayjs().add(1, 'day');
    if (type === 'next-week') target = dayjs().add(1, 'week');
    
    onChange(target.format('YYYY-MM-DD'), timeValue);
    setCurrentMonth(target);
  };

  const [currentHour, currentMinute] = (timeValue || '09:00').split(':');

  return (
    <div className="relative w-full">
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDue ? 'text-rose-600' : 'text-slate-700'}`}>
        {label}
      </label>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left border border-zinc-200 rounded-lg text-xs bg-slate-50 hover:bg-white active:bg-slate-50/50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer shadow-3xs"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className={`w-4 h-4 shrink-0 ${isDue ? 'text-rose-500' : 'text-indigo-500'}`} />
          <span className="truncate font-semibold text-slate-800">{displayFormatted()}</span>
        </div>
        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      </button>

      {/* Popover */}
      {isOpen && (
        <>
          {/* Backdrop layer to click away */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          
          <div className={`absolute top-full mt-1.5 bg-white border border-zinc-200 rounded-2xl shadow-xl p-4 z-50 animate-fade-in text-slate-800 space-y-4 w-[295px] xs:w-[324px] max-w-[calc(100vw-32px)] left-1/2 -translate-x-1/2 ${
            isDue 
              ? 'sm:left-auto sm:right-0 sm:translate-x-0' 
              : 'sm:left-0 sm:right-auto sm:translate-x-0'
          }`}>
            
            {/* Header: Month and Year selectors */}
            <div className="flex items-center justify-between gap-1 pb-2 border-b border-zinc-100">
              <button
                type="button"
                onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                {/* Month Dropdown */}
                <select
                  value={currentMonth.month()}
                  onChange={(e) => setCurrentMonth(currentMonth.month(parseInt(e.target.value)))}
                  className="bg-transparent hover:bg-slate-50 p-1 rounded cursor-pointer font-sans"
                >
                  {THAI_MONTH_NAMES.map((mName, idx) => (
                    <option key={idx} value={idx}>{mName}</option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={currentMonth.year()}
                  onChange={(e) => setCurrentMonth(currentMonth.year(parseInt(e.target.value)))}
                  className="bg-transparent hover:bg-slate-50 p-1 rounded cursor-pointer font-mono"
                >
                  {yearsRange.map((yr) => (
                    <option key={yr} value={yr}>พ.ศ. {yr + 543}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets for Days */}
            <div className="flex gap-1.5 justify-between">
              <button
                type="button"
                onClick={() => handleShortcut('today')}
                className="flex-1 text-[10px] sm:text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-zinc-100 rounded-lg py-1 px-1.5 font-medium transition-colors cursor-pointer text-center"
              >
                วันนี้ (Today)
              </button>
              <button
                type="button"
                onClick={() => handleShortcut('tomorrow')}
                className="flex-1 text-[10px] sm:text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-zinc-100 rounded-lg py-1 px-1.5 font-medium transition-colors cursor-pointer text-center"
              >
                พรุ่งนี้ (Tomorrow)
              </button>
              <button
                type="button"
                onClick={() => handleShortcut('next-week')}
                className="flex-1 text-[10px] sm:text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-zinc-100 rounded-lg py-1 px-1.5 font-medium transition-colors cursor-pointer text-center"
              >
                สัปดาห์หน้า
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1">
              {/* Day headers */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                <span>อา.</span><span>จ.</span><span>อ.</span><span>พ.</span><span>พฤ.</span><span>ศ.</span><span>ส.</span>
              </div>
              
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-0.5 animate-fade-in-down">
                {allCells.map((cell, idx) => {
                  const isSelected = cell.dateStr === dateValue;
                  const isToday = cell.dateStr === dayjs().format('YYYY-MM-DD');
                  
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleDayClick(cell.dateStr)}
                      className={`h-7 w-7 text-center mx-auto text-[11px] font-mono rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-600 text-white font-bold shadow-xs scale-105' 
                          : isToday
                            ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                            : cell.isCurrentMonth
                              ? 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                              : 'text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cell.dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Picker block */}
            <div className="pt-3 border-t border-zinc-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>กำหนดเวลา (Time)</span>
                </span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-mono">
                  {timeValue || '09:00'} น.
                </span>
              </div>

              {/* Preset times buttons */}
              <div className="grid grid-cols-5 gap-1">
                {['09:00', '13:00', '16:00', '18:00', '23:59'].map((pTime) => {
                  const isActive = timeValue === pTime;
                  let tLabel = pTime;
                  if (pTime === '09:00') tLabel = 'เช้า';
                  if (pTime === '13:00') tLabel = 'บ่าย';
                  if (pTime === '16:00') tLabel = 'เย็น';
                  if (pTime === '18:00') tLabel = 'ค่ำ';
                  if (pTime === '23:59') tLabel = 'เที่ยงคืน';
                  
                  return (
                    <button
                      key={pTime}
                      type="button"
                      onClick={() => handlePresetTime(pTime)}
                      className={`text-[9px] py-1 border rounded-md font-medium transition-all cursor-pointer text-center ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-3xs'
                          : 'bg-slate-50 border-zinc-100 hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                      }`}
                      title={pTime}
                    >
                      {tLabel}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Hour & Minute select wheels */}
              <div className="bg-slate-50 p-2 rounded-xl grid grid-cols-2 gap-2 border border-zinc-150">
                <div>
                  <label className="text-[9px] text-slate-400 block font-bold mb-0.5 uppercase">ชั่วโมง</label>
                  <select
                    value={currentHour}
                    onChange={(e) => handleTimeChange('hour', e.target.value)}
                    className="w-full text-xs p-1 px-1.5 border border-zinc-200 rounded-md bg-white font-mono text-slate-700 cursor-pointer font-bold focus:ring-1 focus:ring-indigo-400"
                  >
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const hStr = String(idx).padStart(2, '0');
                      return <option key={idx} value={hStr}>{hStr} น.</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block font-bold mb-0.5 uppercase">นาที</label>
                  <select
                    value={currentMinute}
                    onChange={(e) => handleTimeChange('minute', e.target.value)}
                    className="w-full text-xs p-1 px-1.5 border border-zinc-200 rounded-md bg-white font-mono text-slate-700 cursor-pointer font-bold focus:ring-1 focus:ring-indigo-400"
                  >
                    {Array.from({ length: 60 }).map((_, idx) => {
                      const mStr = String(idx).padStart(2, '0');
                      return <option key={idx} value={mStr}>{mStr} นาที</option>;
                    })}
                  </select>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 font-semibold py-1.5 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                ตกลง (Done)
              </button>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}

export default function WorkspacePage() {
  // --- STATE ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'matrix' | 'kanban' | 'table'>('dashboard');
  
  // Dashboard completion toggle checkboxes corresponding to user references
  const [showCompletedFocus, setShowCompletedFocus] = useState<boolean>(false);
  const [showCompletedPlans, setShowCompletedPlans] = useState<boolean>(false);
  
  // Filtering & Searching
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dashboardProjectFilter, setDashboardProjectFilter] = useState<string>('All');
  const [kanbanProjectFilter, setKanbanProjectFilter] = useState<string>('All');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('All');
  const [tableAssigneeFilter, setTableAssigneeFilter] = useState<string>('All');
  
  // Task Entry Form States
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formValues, setFormValues] = useState({
    title: '',
    project: '',
    category: 'Development',
    assignee: '',
    startDate: getRelativeDateStr(0),
    startTime: '09:00',
    dueDate: getRelativeDateStr(1),
    dueTime: '18:00',
    isImportant: false,
    isUrgent: false,
    notes: '',
    status: 'not-started' as Task['status'],
    progress: 0
  });

  const [formTouched, setFormTouched] = useState<boolean>(false);
  const [showFormTooltip, setShowFormTooltip] = useState<boolean>(false);

  // Suggested values for quick picking
  const SUGGESTED_PROJECTS = ['Workspace Design', 'Workspace Engine', 'Marketing Strategy', 'Legal & Ops', 'Market Research', 'Customer Success'];
  const CATEGORIES = ['Design', 'Development', 'Marketing', 'Research', 'Operations', 'Review', 'General'];
  const ASSIGNEES = ['Apiwat (Developer)', 'Nattaporn (Full-stack)', 'Priya (Strategy)', 'Somchai (Legal Lead)', 'Jane Doe (Manager)'];

  // --- INITIALIZE & SYNC WITH LOCAL STORAGE ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem('task_workspace_data');
      
      const timer = setTimeout(() => {
        if (storedTasks) {
          try {
            setTasks(JSON.parse(storedTasks));
          } catch (e) {
            console.error("Failed to parse stored tasks, resting to defaults", e);
            setTasks(DEFAULT_TASKS);
          }
        } else {
          setTasks(DEFAULT_TASKS);
          localStorage.setItem('task_workspace_data', JSON.stringify(DEFAULT_TASKS));
        }
        setMounted(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, []);

  const saveTasksToStorage = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    if (typeof window !== 'undefined') {
      localStorage.setItem('task_workspace_data', JSON.stringify(updatedTasks));
    }
  };

  // --- UTILITIES ---
  // Unified status details helper mapping
  const getWorkflowStatusDetails = (status: Task['status'], progress: number) => {
    switch (status) {
      case 'completed':
        return { text: 'เสร็จแล้ว', icon: '✅', color: 'text-emerald-600 font-semibold' };
      case 'revising':
        return { text: 'แก้ไข', icon: '🚀', color: 'text-indigo-600 font-semibold' };
      case 'disapproved':
        return { text: 'ไม่อนุมัติ', icon: '❌', color: 'text-rose-600 font-semibold' };
      case 'review':
        return { text: 'ตรวจสอบ', icon: '👀', color: 'text-amber-600 font-semibold' };
      case 'in-progress':
        return { text: 'กำลังทำ', icon: '⏳', color: 'text-indigo-600 font-semibold' };
      case 'not-started':
      default:
        return { text: 'ยังไม่เริ่ม', icon: '🕒', color: 'text-slate-500' };
    }
  };

  // Countdown calculation based on current date
  const computeCountdown = (dueDateStr: string, isCompleted: boolean) => {
    if (isCompleted) {
      return { days: 0, text: 'งานเสร็จสิ้นแล้ว', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { days: 0, text: '• ครบกำหนดวันนี้', color: 'bg-rose-500 text-white border-rose-600 animate-pulse font-medium' };
    } else if (diffDays === 1) {
      return { days: 1, text: '• ครบกำหนดพรุ่งนี้', color: 'bg-amber-500 text-white border-amber-600 font-medium' };
    } else if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      return { days: diffDays, text: `⚠️ เลยกำหนด ${absDays} วัน`, color: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold' };
    } else {
      return { days: diffDays, text: `เหลืออีก ${diffDays} วัน`, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  // Get Dynamic Unique projects for dropdown filters
  const getUniqueProjects = () => {
    const list = tasks.map(t => t.project).filter(p => p.trim() !== '');
    return Array.from(new Set([...SUGGESTED_PROJECTS, ...list]));
  };

  // --- FORM HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: 'isImportant' | 'isUrgent') => {
    setFormValues(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleQuickSelectProject = (project: string) => {
    setFormValues(prev => ({ ...prev, project }));
  };

  const handleQuickSelectAssignee = (assignee: string) => {
    setFormValues(prev => ({ ...prev, assignee }));
  };

  const resetForm = () => {
    setFormValues({
      title: '',
      project: '',
      category: 'Development',
      assignee: '',
      startDate: getRelativeDateStr(0),
      startTime: '09:00',
      dueDate: getRelativeDateStr(1),
      dueTime: '18:00',
      isImportant: false,
      isUrgent: false,
      notes: '',
      status: 'not-started',
      progress: 0
    });
    setIsEditing(false);
    setEditingId(null);
    setFormTouched(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);

    if (!formValues.title.trim()) {
      return; // Validation fails
    }

    const taskProject = formValues.project.trim() || 'General Project (ทั่วไป)';
    const taskAssignee = formValues.assignee.trim() || 'ไม่ได้ระบุผู้รับผิดชอบ';

    if (isEditing && editingId) {
      // Edit mode
      const updated = tasks.map(t => {
        if (t.id === editingId) {
          let finalProgress = formValues.progress;
          if (formValues.status === 'completed') finalProgress = 100;
          else if (formValues.status === 'not-started') finalProgress = 0;
          else if (formValues.status === 'revising' && (finalProgress < 80 || finalProgress >= 100)) finalProgress = 85;
          else if (formValues.status === 'disapproved' && finalProgress > 50) finalProgress = 30;
          const finalStatus = formValues.status;

          return {
            ...t,
            title: formValues.title,
            project: taskProject,
            category: formValues.category,
            assignee: taskAssignee,
            startDate: formValues.startDate,
            startTime: formValues.startTime,
            dueDate: formValues.dueDate,
            dueTime: formValues.dueTime,
            isImportant: formValues.isImportant,
            isUrgent: formValues.isUrgent,
            status: finalStatus as Task['status'],
            progress: finalProgress,
            notes: formValues.notes
          };
        }
        return t;
      });
      saveTasksToStorage(updated);
    } else {
      // Add mode
      let finalProgress = formValues.progress;
      if (formValues.status === 'completed') finalProgress = 100;
      else if (formValues.status === 'not-started') finalProgress = 0;
      else if (formValues.status === 'revising' && (finalProgress < 80 || finalProgress >= 100)) finalProgress = 85;
      else if (formValues.status === 'disapproved' && finalProgress > 50) finalProgress = 30;
      const finalStatus = formValues.status;
      
      const newTask: Task = {
        id: 'task-' + Date.now(),
        title: formValues.title,
        project: taskProject,
        category: formValues.category,
        assignee: taskAssignee,
        startDate: formValues.startDate,
        startTime: formValues.startTime,
        dueDate: formValues.dueDate,
        dueTime: formValues.dueTime,
        isImportant: formValues.isImportant,
        isUrgent: formValues.isUrgent,
        status: finalStatus as Task['status'],
        progress: finalProgress,
        notes: formValues.notes,
        createdAt: new Date().toISOString()
      };
      saveTasksToStorage([newTask, ...tasks]);
    }

    resetForm();
  };

  // --- ACTIONS ---
  // Start the edit process inside the form panel
  const handleStartEdit = (task: Task) => {
    setIsEditing(true);
    setEditingId(task.id);
    setFormValues({
      title: task.title,
      project: task.project,
      category: task.category,
      assignee: task.assignee,
      startDate: task.startDate,
      startTime: task.startTime || '09:00',
      dueDate: task.dueDate,
      dueTime: task.dueTime || '18:00',
      isImportant: task.isImportant,
      isUrgent: task.isUrgent,
      notes: task.notes || '',
      status: task.status,
      progress: task.progress
    });
    // Scroll form into view for mobile users
    const element = document.getElementById('form-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick toggle Completed Status - hides task from Active list on Dashboard
  const handleToggleComplete = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'in-progress' : 'completed';
        const nextProgress = nextStatus === 'completed' ? 100 : 50;
        return {
          ...t,
          status: nextStatus as Task['status'],
          progress: nextProgress
        };
      }
      return t;
    });
    saveTasksToStorage(updated);
  };

  // Update Progress directly from the dashboard or table row
  const handleProgressChange = (taskId: string, newProgress: number) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        let nextStatus = t.status;
        if (newProgress === 100) nextStatus = 'completed';
        else if (newProgress === 85) nextStatus = 'revising';
        else if (newProgress === 30) nextStatus = 'disapproved';
        else if (newProgress >= 70 && newProgress < 100) nextStatus = 'review';
        else if (newProgress > 0 && newProgress < 70) nextStatus = 'in-progress';
        else if (newProgress === 0) nextStatus = 'not-started';

        return {
          ...t,
          progress: newProgress,
          status: nextStatus as Task['status']
        };
      }
      return t;
    });
    saveTasksToStorage(updated);
  };

  // Update Status directly on Kanban/List
  const handleUpdateStatus = (taskId: string, nextStatus: Task['status']) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        let nextProgress = t.progress;
        if (nextStatus === 'completed') nextProgress = 100;
        else if (nextStatus === 'not-started') nextProgress = 0;
        else if (nextStatus === 'review') {
          if (t.progress < 70 || t.progress >= 100) nextProgress = 75;
        } else if (nextStatus === 'in-progress') {
          if (t.progress < 10 || t.progress >= 70) nextProgress = 50;
        } else if (nextStatus === 'revising') {
          nextProgress = 85;
        } else if (nextStatus === 'disapproved') {
          nextProgress = 30;
        }

        return {
          ...t,
          status: nextStatus,
          progress: nextProgress
        };
      }
      return t;
    });
    saveTasksToStorage(updated);
  };

  // Delete Task
  const handleDeleteTask = (taskId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้ออกจากระบบ?')) {
      const filtered = tasks.filter(t => t.id !== taskId);
      saveTasksToStorage(filtered);
      if (editingId === taskId) {
        resetForm();
      }
    }
  };

  // Reset workspace back to dynamic default mock data
  const handleResetToDefaults = () => {
    if (confirm('ระบบจะเขียนทับงานปัจจุบันด้วยข้อมูลจำลองเริ่มต้นเพื่อทดสอบความความถูกต้อง คุณยอมรับหรือไม่?')) {
      saveTasksToStorage(DEFAULT_TASKS);
      resetForm();
    }
  };

  // --- BOTTLENECK IDENTIFICATION ---
  // If "In Progress" has too many tasks, it highlights bottleneck problems
  const checkKanbanBottlenecks = () => {
    const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
    const notStartedCount = tasks.filter(t => t.status === 'not-started').length;
    const reviewCount = tasks.filter(t => t.status === 'review').length;
    
    return {
      inProgressBottleneck: inProgressCount >= 3,
      notStartedWarning: notStartedCount >= 4,
      reviewBottleneck: reviewCount >= 3,
      inProgressCount,
      notStartedCount,
      reviewCount
    };
  };

  const bottleneckInfo = checkKanbanBottlenecks();

  // --- FILTERED TASK SUBSETS ---
  
  // Dashboard view only lists ACTIVE (uncompleted) tasks to prevent visual clutter
  const activeDashboardTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Project filter
    const matchesProject = dashboardProjectFilter === 'All' || task.project === dashboardProjectFilter;
    
    return matchesSearch && matchesProject;
  });

  // Kanban view can filters by selected project
  const kanbanFilteredTasks = (status: Task['status']) => {
    return tasks.filter(task => {
      const matchesProject = kanbanProjectFilter === 'All' || task.project === kanbanProjectFilter;
      return task.status === status && matchesProject;
    });
  };

  // Table view lists ALL matching filtered tasks to allow precise oversight
  const filteredTableTasks = tasks.filter(task => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(query) ||
                          task.project.toLowerCase().includes(query) ||
                          task.assignee.toLowerCase().includes(query) ||
                          (task.notes && task.notes.toLowerCase().includes(query));

    const matchesProject = kanbanProjectFilter === 'All' || task.project === kanbanProjectFilter;
    const matchesStatus = tableStatusFilter === 'All' || task.status === tableStatusFilter;
    const matchesAssignee = tableAssigneeFilter === 'All' || task.assignee === tableAssigneeFilter;

    return matchesSearch && matchesProject && matchesStatus && matchesAssignee;
  });

  // Matrix subdivisions:
  // "Important" (สำคัญ), "Urgent" (เร่งด่วน), and "Can Wait" (รอได้)
  const matrixTasks = {
    importantAndUrgent: tasks.filter(t => t.isImportant && t.isUrgent && t.status !== 'completed'),
    importantButNotUrgent: tasks.filter(t => t.isImportant && !t.isUrgent && t.status !== 'completed'), // Plan / Wait
    urgentButNotImportant: tasks.filter(t => !t.isImportant && t.isUrgent && t.status !== 'completed'), // Delegate
    canWait: tasks.filter(t => !t.isImportant && !t.isUrgent && t.status !== 'completed') // General Can Wait / Leisure
  };

  // General Analytics
  const totalCompleted = tasks.filter(t => t.status === 'completed').length;
  const criticalOverdueCount = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(t.dueDate);
    due.setHours(0,0,0,0);
    return due.getTime() < today.getTime();
  }).length;

  const criticalTodayCount = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(t.dueDate);
    due.setHours(0,0,0,0);
    return due.getTime() === today.getTime();
  }).length;

  const totalActiveTasks = tasks.filter(t => t.status !== 'completed').length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  // HTML5 Drag and Drop Handlers for Kanban
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      handleUpdateStatus(taskId, status);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-zinc-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-sm font-medium text-slate-500 font-mono">WORKSPACE LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      
      {/* --- HEADER BAR --- */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 font-mono">Workspace Suite</span>
          </div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-slate-900 sm:text-4xl">
            Task Management Workspace <span className="font-sans text-xl font-normal text-slate-400">| ร่วมระบบงานคุณครูและทีม</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            ศูนย์กลางประมวลผลตารางตารางงานอัจฉริยะ ซิงค์ข้อมูลอัตโนมัติแบบ Real-time บนคัมบังบอร์ดและแมทริกซ์ความรวดเร็ว
          </p>
        </div>
        
        {/* Reset utilities */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <button 
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white text-xs font-medium text-slate-600 transition-all hover:bg-slate-50 cursor-pointer shadow-sm"
            title="รีเซ็ตโปรเจกต์ด้วยชุดข้อมูลจำลองที่มี countdown ครบและคอขวดสะสม"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-hover spin" />
            <span>ใช้ข้อมูลจำลองเริ่มต้น</span>
          </button>
          
          <div className="hidden sm:flex flex-col text-right font-mono text-xs text-slate-400">
            <span>📅 วันนี้: 20 มิถุนายน 2026</span>
            <span>📍 สิทธิ์การแก้ไข: เจ้าของโปรเจกต์</span>
          </div>
        </div>
      </header>

      {/* --- RECONCILING ANALYTICS BAR --- */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Active Tasks Card */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-sans">งานที่ค้างอยู่ (Active)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-display">{totalActiveTasks}</span>
              <span className="text-xs text-slate-400">งานที่ต้องทำ</span>
            </div>
          </div>
        </div>

        {/* Critical Targets Card */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className={`p-3 rounded-xl ${(criticalOverdueCount + criticalTodayCount) > 0 ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500">วิกฤต (เลยกำหนด / วันนี้)</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-display ${(criticalOverdueCount + criticalTodayCount) > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {criticalOverdueCount + criticalTodayCount}
              </span>
              <span className="text-xs text-slate-400">
                {criticalOverdueCount > 0 ? `เลย ${criticalOverdueCount} วัน` : 'เป้าหมายวันนี้'}
              </span>
            </div>
          </div>
        </div>

        {/* Completed Projects Card */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-500">เสร็จสมบูรณ์แล้ว</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-display">{totalCompleted}</span>
              <span className="text-xs text-slate-400">งานสำเร็จ</span>
            </div>
          </div>
        </div>

        {/* Progress Rate Ring Card */}
        <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-sm flex flex-col justify-center transition-all hover:shadow-md gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">อัตราความสำเร็จโดยรวม</span>
            <span className="text-xs font-semibold text-indigo-600 font-mono">{taskCompletionRate}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${taskCompletionRate}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">
            คำนวณจากกิจกรรมงานเสร็จสิ้นหารด้วยจำนวนงานทั้งหมดในบอร์ด
          </p>
        </div>

      </section>

      {/* --- PRIMARY GRID: LEFT FORM, RIGHT WORKSPACE AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ====================================================================== */}
        {/* 1. TASK ENTRY FORM SIDE PANEL (12 columns on mobile, 4 columns on large) */}
        {/* ====================================================================== */}
        <aside id="form-section" className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm sticky top-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-50 rounded text-amber-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <p className="text-base font-semibold text-slate-900 font-display">
                {isEditing ? '✏️ แก้ไขข้อมูลงาน' : '📝 ถังกรอกข้อมูลงานใหม่'}
              </p>
            </div>
            
            {isEditing && (
              <button 
                onClick={resetForm}
                className="text-xs text-rose-500 hover:underline font-medium"
              >
                ยกเลิกแก้ไข
              </button>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            {/* Task Title Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ชื่องาน (Task Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                  formTouched && !formValues.title.trim() ? 'border-rose-400 ring-2 ring-rose-200/50' : 'border-zinc-200'
                }`}
                placeholder="เช่น ออกแบบ UI ชิ้นส่วนหลัก, ตรวจสอบงบปี..."
                maxLength={90}
              />
              {formTouched && !formValues.title.trim() && (
                <p className="text-[11px] text-rose-500 mt-1">กรุณาระบุชื่องานที่จำเป็น</p>
              )}
            </div>

            {/* Project Input with dynamic auto-suggestions */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  โปรเจกต์ (Project)
                </label>
                <span className="text-[10px] text-slate-400">พิมพ์เองหรือกดเลือกด่วน</span>
              </div>
              <input
                type="text"
                name="project"
                value={formValues.project}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
                placeholder="พิมพ์โปรเจกต์งานนี้..."
                maxLength={45}
              />
              {/* Quick Select Buttons */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {getUniqueProjects().slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickSelectProject(p)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-0.5 rounded transition-all cursor-pointer border border-zinc-200/40"
                  >
                    + {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Category and Assignee Block */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  หมวดหมู่ (Category)
                </label>
                <select
                  name="category"
                  value={formValues.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {CATEGORIES.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ผู้รับผิดชอบ (Assignee)
                </label>
                <select
                  name="assignee"
                  value={formValues.assignee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="">-- เลือกผู้รับผิดชอบ --</option>
                  {ASSIGNEES.map((person, idx) => (
                    <option key={idx} value={person}>{person}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Start and Due Date split with premium Custom Thai Buddhist Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <THDateTimePicker
                label="เริ่มต้น (Start Date)"
                dateValue={formValues.startDate}
                timeValue={formValues.startTime || '09:00'}
                onChange={(newDate, newTime) => {
                  setFormValues(prev => ({
                    ...prev,
                    startDate: newDate,
                    startTime: newTime
                  }));
                }}
              />

              <THDateTimePicker
                label="วันส่งงาน (Due Date)"
                dateValue={formValues.dueDate}
                timeValue={formValues.dueTime || '18:00'}
                onChange={(newDate, newTime) => {
                  setFormValues(prev => ({
                    ...prev,
                    dueDate: newDate,
                    dueTime: newTime
                  }));
                }}
                isDue
              />
            </div>

            {/* Status & Progress (Visible inside form during edits or manual addition) */}
            <div className="border border-zinc-100 p-3 bg-zinc-50/50 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    สถานะการทำงาน
                  </label>
                  <select
                    name="status"
                    value={formValues.status}
                    onChange={(e) => {
                      const nextStat = e.target.value as Task['status'];
                      let nextProgress = formValues.progress;
                      if (nextStat === 'completed') nextProgress = 100;
                      else if (nextStat === 'not-started') nextProgress = 0;
                      else if (nextStat === 'review') nextProgress = 75;
                      else if (nextStat === 'in-progress') nextProgress = 50;
                      else if (nextStat === 'revising') nextProgress = 85;
                      else if (nextStat === 'disapproved') nextProgress = 30;

                      setFormValues(prev => ({
                        ...prev,
                        status: nextStat,
                        progress: nextProgress
                      }));
                    }}
                    className="w-full px-2 py-1.5 border border-zinc-200 rounded bg-white text-xs cursor-pointer text-slate-800 font-medium"
                  >
                    <option value="not-started">🕒 ยังไม่เริ่ม (Not Started)</option>
                    <option value="in-progress">⏳ กำลังทำ (In Progress)</option>
                    <option value="review">👀 ตรวจสอบ (Review)</option>
                    <option value="revising">🚀 แก้ไข (Revising)</option>
                    <option value="disapproved">❌ ไม่อนุมัติ (Disapproved)</option>
                    <option value="completed">✅ เสร็จแล้ว (Completed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    ความคืบหน้า ({formValues.progress}%)
                  </label>
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    step="5"
                    disabled={formValues.status === 'completed' || formValues.status === 'not-started'}
                    value={formValues.status === 'completed' ? 100 : (formValues.status === 'not-started' ? 0 : formValues.progress)}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      let nextStatus = formValues.status;
                      if (value === 100) nextStatus = 'completed';
                      else if (value >= 80) nextStatus = 'review';
                      else if (value > 0 && formValues.status !== 'review') nextStatus = 'in-progress';

                      setFormValues(prev => ({
                        ...prev,
                        progress: value,
                        status: nextStatus
                      }));
                    }}
                    className="w-full mt-2 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none accent-indigo-600 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Prioritization Toggle Boxes (Important & Urgent mapping to Matrix) */}
            <div className="border border-zinc-100 p-3 bg-zinc-50/50 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  ⚠️ การประเมินเพื่อจัดลำดับความเร่งด่วน
                </span>
                <button 
                  type="button"
                  onClick={() => setShowFormTooltip(!showFormTooltip)}
                  className="text-slate-400 hover:text-indigo-600 transition-all"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>

              {showFormTooltip && (
                <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg text-[11px] text-indigo-800 mb-3 leading-relaxed">
                  เมื่อติ๊กเลือกด้านล่าง ข้อมูลงานจะวางใน <strong>Prioritization Matrix (หน้าจัดกลุ่มความสำคัญ)</strong> ให้อยู่ในกลุ่มที่ถูกต้องเพื่อช่วยประเมินการลำดับความคิดในทุกเช้า
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCheckboxChange('isImportant')}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs text-left cursor-pointer ${
                    formValues.isImportant 
                      ? 'bg-rose-50/70 border-rose-200 text-rose-800 font-semibold shadow-inner' 
                      : 'bg-white border-zinc-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span>สำคัญ (Important)</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    formValues.isImportant ? 'bg-rose-600 border-rose-700' : 'border-zinc-300'
                  }`}>
                    {formValues.isImportant && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCheckboxChange('isUrgent')}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all text-xs text-left cursor-pointer ${
                    formValues.isUrgent 
                      ? 'bg-amber-50/70 border-amber-200 text-amber-800 font-semibold shadow-inner' 
                      : 'bg-white border-zinc-100 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span>เร่งด่วน (Urgent)</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    formValues.isUrgent ? 'bg-amber-600 border-amber-700' : 'border-zinc-300'
                  }`}>
                    {formValues.isUrgent && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                รายละเอียดงานเพิ่มเติม (Notes)
              </label>
              <textarea
                name="notes"
                value={formValues.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none"
                placeholder="ข้อมูลเพิ่มเติมเพื่อช่วยเตือนความจำ..."
                maxLength={200}
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg font-medium text-sm text-white shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
                isEditing 
                ? 'bg-amber-600 hover:bg-amber-700 active:scale-98' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98'
              }`}
            >
              {isEditing ? (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>บันทึกการแก้ไขงาน</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มงานใหม่ไปยังระบบ</span>
                </>
              )}
            </button>

          </form>

          {/* Guidelines info inside sidebar spacer */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-zinc-100 text-[11px] text-slate-500 leading-relaxed text-center">
            <strong>💡 ความลับของเวิร์กสเปซ:</strong> ข้อมูลงานทั้งหมดจะบันทึกทันทีในเบราว์เซอร์ และประสานการเปลี่ยนแปลงข้ามวิวทั้ง Dashboard, Matrix และ Kanban โดยอัตโนมัติ
          </div>
        </aside>

        {/* ====================================================================== */}
        {/* 2. MAIN APPLICATION WORKSPACE AREA (8 columns on large screen)        */}
        {/* ====================================================================== */}
        <main className="lg:col-span-8 space-y-6">
          
          {/* NAVIGATION VIEWS TABBAR */}
          <div className="bg-white p-1 rounded-xl border border-zinc-200 shadow-xs flex select-none mb-6">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-slate-900 text-white shadow-xs font-bold ring-offset-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>สรุปงานรายวัน (Dashboard)</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'matrix' 
                  ? 'bg-slate-900 text-white shadow-xs font-bold ring-offset-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>ลำดับความสำคัญ (Matrix)</span>
            </button>

            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'kanban' 
                  ? 'bg-slate-900 text-white shadow-xs font-bold ring-offset-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>คัมบังบอร์ด (Kanban)</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'table' 
                  ? 'bg-slate-900 text-white shadow-xs font-bold ring-offset-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>ตารางงาน (Table Row)</span>
            </button>

          </div>

          {/* VIEW SWITCHER RENDERING */}
          <AnimatePresence mode="wait">
            
            {/* ========================================== */}
            {/* VIEW A: DAILY DASHBOARD (REPLICATING IMAGES)*/}
            {/* ========================================== */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* 1. TITLE BANNER EXACTLY AS THE SCREENSHOT */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight font-sans">
                    ตารางมอบหมายงาน
                  </h2>
                  <p className="text-sm font-mono font-semibold text-slate-400 mt-1.5 uppercase tracking-wide">
                    {(() => {
                      const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      const cur = new Date();
                      return `${weekdays[cur.getDay()]} ${String(cur.getDate()).padStart(2, '0')} ${months[cur.getMonth()]} ${cur.getFullYear()}`;
                    })()}
                  </p>
                </div>

                {/* 2. DYNAMIC REAL-TIME STATS (การแจ้งเตือน BLOCK WITH EXACTLY 3 NOTIFICATION CARDS) */}
                {(() => {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  
                  let dueTomorrowCount = 0;
                  let dueTodayCount = 0;
                  let dueNextWeekCount = 0;
                  let overdueCount = 0;
                  let completedCount = 0;
                  const totalCount = tasks.length;
                  
                  tasks.forEach(t => {
                    if (t.status === 'completed') {
                      completedCount++;
                      return;
                    }
                    const due = new Date(t.dueDate);
                    due.setHours(0,0,0,0);
                    const diffTime = due.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    if (diffDays === 0) {
                      dueTodayCount++;
                    } else if (diffDays === 1) {
                      dueTomorrowCount++;
                    } else if (diffDays < 0) {
                      overdueCount++;
                    } else if (diffDays > 1 && diffDays <= 7) {
                      dueNextWeekCount++;
                    }
                  });

                  const completionRatePercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
                  const remainingCount = totalCount - completedCount;

                  return (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                        การแจ้งเตือน
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Notify card 1: Warning of tomorrow & today and next week */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-200/60 flex items-center justify-center text-rose-500 font-bold shadow-2xs">
                            <span className="text-xl">⚠️</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 leading-tight">
                              แจ้งเตือน: มี {dueTomorrowCount} งานต้องทำพรุ่งนี้
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                              ลุยกันต่อ - มี {dueTodayCount} งานต้องทำวันนี้, และอีก {dueNextWeekCount} งานในสัปดาห์หน้า!
                            </p>
                          </div>
                        </div>

                        {/* Notify card 2: Completion Progress with real-time math percentage */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-200/60 flex items-center justify-center text-indigo-500 font-bold shadow-2xs">
                            <span className="text-xl">📈</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-800 leading-tight">
                              ทำเสร็จไปแล้ว {completionRatePercent.toFixed(1)}%
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                              เสร็จไป {completedCount} งาน เหลืออีก {remainingCount} งาน - สู้ต่อไป!
                            </p>
                          </div>
                        </div>

                        {/* Notify card 3: Overdue tracking */}
                        <div className="flex items-start gap-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-200/60 flex items-center justify-center text-amber-500 font-bold shadow-2xs">
                            <span className="text-xl">🚩</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800 leading-tight">
                              งานที่เลยกำหนด : {overdueCount}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                              อย่าลืมไปจัดการให้เรียบร้อยนะ
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* SEARCH STRIP IF THEY WANT TO QUICK FILTER */}
                <div className="bg-white p-3 rounded-xl border border-slate-200/85 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none transition-all"
                      placeholder="พิมพ์ค้นหางาน ชื่อคน โฟลเดอร์ที่นี่..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    value={dashboardProjectFilter}
                    onChange={(e) => setDashboardProjectFilter(e.target.value)}
                    className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 cursor-pointer font-sans w-full sm:w-auto"
                  >
                    <option value="All">ทุกโปรเจกต์</option>
                    {getUniqueProjects().map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* 3. "โฟกัสวันนี้" (FOCUS TODAY SECTION) */}
                {(() => {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  
                  const getPriorityLabel = (isImportant: boolean, isUrgent: boolean) => {
                    if (isImportant && isUrgent) return { text: 'ด่วนมาก', color: 'text-rose-600', dot: 'bg-rose-500 animate-pulse' };
                    if (isImportant) return { text: 'ด่วน', color: 'text-amber-600', dot: 'bg-rose-500' };
                    if (isUrgent) return { text: 'ปกติ', color: 'text-amber-500', dot: 'bg-yellow-500' };
                    return { text: 'ไม่รีบ', color: 'text-emerald-500', dot: 'bg-emerald-500' };
                  };

                  const getStatusBadge = (status: Task['status'], progress: number) => {
                    if (status === 'completed') {
                      return { text: 'เสร็จแล้ว', icon: '✅', color: 'text-emerald-600' };
                    }
                    if (status === 'revising' || (status === 'review' && progress === 85)) {
                      return { text: 'แก้ไข', icon: '🚀', color: 'text-indigo-600 font-semibold' };
                    }
                    if (status === 'disapproved' || progress === 30) {
                      return { text: 'ไม่อนุมัติ', icon: '❌', color: 'text-rose-600 font-semibold' };
                    }
                    if (status === 'review') {
                      return { text: 'ตรวจสอบ', icon: '👀', color: 'text-amber-600 font-semibold' };
                    }
                    if (status === 'in-progress') {
                      return { text: 'กำลังทำ', icon: '⏳', color: 'text-slate-600 font-semibold' };
                    }
                    return { text: 'ยังไม่เริ่ม', icon: '🕒', color: 'text-slate-500' };
                  };

                  const focusList = tasks.filter(t => {
                    const due = new Date(t.dueDate);
                    due.setHours(0,0,0,0);
                    const diffTime = due.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    // Focus list criteria: Due today / past due (overdue), or important/urgent
                    const isDueTodayOrOverdue = diffDays <= 0;
                    const isImportantUrgentFocus = t.isImportant;

                    const matchesSearch = searchQuery === '' || 
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      t.project.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesProject = dashboardProjectFilter === 'All' || t.project === dashboardProjectFilter;

                    if (!matchesSearch || !matchesProject) return false;

                    if (t.status === 'completed') {
                      return showCompletedFocus && (isDueTodayOrOverdue || isImportantUrgentFocus);
                    }
                    return isDueTodayOrOverdue || isImportantUrgentFocus;
                  });

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 font-sans flex items-center gap-2">
                          <span>📍</span> โฟกัสวันนี้
                        </h3>
                        
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={showCompletedFocus}
                            onChange={(e) => setShowCompletedFocus(e.target.checked)}
                            className="w-3.5 h-3.5 border-slate-300 rounded text-slate-800 focus:ring-slate-500 cursor-pointer"
                          />
                          <span>รวมงานที่เสร็จแล้ว</span>
                        </label>
                      </div>

                      {focusList.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs italic font-sans">
                          ไม่มีงานที่ต้องโฟกัสในวันนี้
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {focusList.map(task => {
                            const prio = getPriorityLabel(task.isImportant, task.isUrgent);
                            const stB = getStatusBadge(task.status, task.progress);
                            
                            return (
                              <motion.div
                                key={task.id}
                                layoutId={`focus-task-${task.id}`}
                                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-4 shadow-3xs hover:border-slate-300 transition-all group relative"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {/* Left Pin Icon box bg-slate-100 with red physical pushpin icon */}
                                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-red-500 shadow-2xs border border-slate-200/50">
                                    <span className="text-lg select-none">📌</span>
                                  </div>
                                  
                                  {/* Task Title and Assignee/Project details */}
                                  <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug line-clamp-2">
                                      {task.title}
                                    </h4>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-semibold sm:mt-0.5 flex flex-wrap items-center gap-1.5">
                                      <span>👤 {task.assignee || 'ไม่ได้ระบุ'}</span>
                                      <span>• 📂 {task.project}</span>
                                      <span className="text-indigo-600 font-bold bg-indigo-50/50 px-1 py-0.2 rounded">• 📅 {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</span>
                                    </p>
                                  </div>
                                </div>

                                {/* Right Side Parameters: Priority Dot and Phase Badge */}
                                <div className="flex-shrink-0 text-right min-w-[100px] space-y-1.5">
                                  {/* Priority Row */}
                                  <div className="flex items-center gap-1.5 justify-end">
                                    <span className={`w-2.5 h-2.5 rounded-full ${prio.dot}`} />
                                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-sans">
                                      {prio.text}
                                    </span>
                                  </div>

                                  {/* Status Row */}
                                  <div className={`flex items-center gap-1 text-[11px] sm:text-xs justify-end font-bold font-sans ${stB.color}`}>
                                    <span>{stB.icon}</span>
                                    <span>{stB.text}</span>
                                  </div>
                                </div>

                                {/* Hover Mini Overlay Controller actions */}
                                <div className="absolute right-3 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white/90 backdrop-blur-xs pl-2 py-0.5 rounded-l-md shadow-3xs">
                                  <button
                                    onClick={() => handleStartEdit(task)}
                                    className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer transition-colors"
                                    title="แก้ไขข้อมูลงานนี้"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                                    title="ลบงานออกจากระบบ"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleComplete(task.id)}
                                    className="p-1 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
                                    title="สลับสถานะเสร็จงาน"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 4. "แพลนวันถัดไป" (NEXT DAYS PLANS SECTION) */}
                {(() => {
                  const today = new Date();
                  today.setHours(0,0,0,0);
                  
                  const getPriorityLabel = (isImportant: boolean, isUrgent: boolean) => {
                    if (isImportant && isUrgent) return { text: 'ด่วนมาก', color: 'text-rose-600', dot: 'bg-rose-500 animate-pulse' };
                    if (isImportant) return { text: 'ด่วน', color: 'text-amber-600', dot: 'bg-rose-500' };
                    if (isUrgent) return { text: 'ปกติ', color: 'text-amber-500', dot: 'bg-yellow-500' };
                    return { text: 'ไม่รีบ', color: 'text-emerald-500', dot: 'bg-emerald-500' };
                  };

                  const getStatusBadge = (status: Task['status'], progress: number) => {
                    if (status === 'completed') {
                      return { text: 'เสร็จแล้ว', icon: '✅', color: 'text-emerald-600' };
                    }
                    if (status === 'revising' || (status === 'review' && progress === 85)) {
                      return { text: 'แก้ไข', icon: '🚀', color: 'text-indigo-600 font-semibold' };
                    }
                    if (status === 'disapproved' || progress === 30) {
                      return { text: 'ไม่อนุมัติ', icon: '❌', color: 'text-rose-600 font-semibold' };
                    }
                    if (status === 'review') {
                      return { text: 'ตรวจสอบ', icon: '👀', color: 'text-amber-600 font-semibold' };
                    }
                    if (status === 'in-progress') {
                      return { text: 'กำลังทำ', icon: '⏳', color: 'text-slate-600 font-semibold' };
                    }
                    return { text: 'ยังไม่เริ่ม', icon: '🕒', color: 'text-slate-500' };
                  };

                  const formatDateToCompact = (dateStr: string) => {
                    try {
                      const d = new Date(dateStr);
                      const day = String(d.getDate()).padStart(2, '0');
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      return `${day}/${month}`;
                    } catch (e) {
                      return '10/06';
                    }
                  };

                  const plansList = tasks.filter(t => {
                    const due = new Date(t.dueDate);
                    due.setHours(0,0,0,0);
                    const diffTime = due.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    // Future criteria: Due date in future (diffDays > 0)
                    // If it is due tomorrow but urgent, it already loaded in focus (except if showCompleted is ticked logic)
                    const isFuture = diffDays > 0;
                    
                    const matchesSearch = searchQuery === '' || 
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      t.project.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesProject = dashboardProjectFilter === 'All' || t.project === dashboardProjectFilter;

                    if (!matchesSearch || !matchesProject) return false;

                    if (!isFuture) return false;

                    if (t.status === 'completed') {
                      return showCompletedPlans;
                    }
                    return true;
                  });

                  return (
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 font-sans flex items-center gap-2">
                          <span>📅</span> แพลนวันถัดไป
                        </h3>
                        
                        <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={showCompletedPlans}
                            onChange={(e) => setShowCompletedPlans(e.target.checked)}
                            className="w-3.5 h-3.5 border-slate-300 rounded text-slate-800 focus:ring-slate-500 cursor-pointer"
                          />
                          <span>รวมงานที่เสร็จแล้ว</span>
                        </label>
                      </div>

                      {plansList.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs italic font-sans">
                          ไม่มีงานในตารางแผนงานวันถัดไป
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {plansList.map(task => {
                            const prio = getPriorityLabel(task.isImportant, task.isUrgent);
                            const stB = getStatusBadge(task.status, task.progress);
                            
                            return (
                              <motion.div
                                key={task.id}
                                layoutId={`plans-task-${task.id}`}
                                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-4 shadow-3xs hover:border-slate-300 transition-all group relative animate-fade-in"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  {/* Left Compact Date badge e.g. "10/06" */}
                                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center font-bold text-slate-500 text-xs shadow-2xs border border-slate-200/50 font-mono">
                                    <span className="text-[11px] sm:text-xs text-slate-400">Due</span>
                                    <span className="text-[11px] sm:text-xs text-slate-600 font-black leading-none mt-0.5">
                                      {formatDateToCompact(task.dueDate)}
                                    </span>
                                  </div>
                                  
                                  {/* Task Title and Assignee/Project details */}
                                  <div className="min-w-0">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug line-clamp-2">
                                      {task.title}
                                    </h4>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-semibold sm:mt-0.5 flex flex-wrap items-center gap-1.5">
                                      <span>👤 {task.assignee || 'ไม่ได้ระบุ'}</span>
                                      <span>• 📂 {task.project}</span>
                                      <span className="text-indigo-600 font-bold bg-indigo-50/50 px-1 py-0.2 rounded">• 📅 {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</span>
                                    </p>
                                  </div>
                                </div>

                                {/* Right Side Parameters: Priority Dot and Phase Badge */}
                                <div className="flex-shrink-0 text-right min-w-[100px] space-y-1.5">
                                  {/* Priority Row */}
                                  <div className="flex items-center gap-1.5 justify-end">
                                    <span className={`w-2.5 h-2.5 rounded-full ${prio.dot}`} />
                                    <span className="text-xs sm:text-sm font-bold text-slate-600 font-sans">
                                      {prio.text}
                                    </span>
                                  </div>

                                  {/* Status Row */}
                                  <div className={`flex items-center gap-1 text-[11px] sm:text-xs justify-end font-bold font-sans ${stB.color}`}>
                                    <span>{stB.icon}</span>
                                    <span>{stB.text}</span>
                                  </div>
                                </div>

                                {/* Hover Mini Overlay Controller actions */}
                                <div className="absolute right-3 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white/90 backdrop-blur-xs pl-2 py-0.5 rounded-l-md shadow-3xs">
                                  <button
                                    onClick={() => handleStartEdit(task)}
                                    className="p-1 text-slate-400 hover:text-amber-600 cursor-pointer transition-colors"
                                    title="แก้ไขข้อมูลงานนี้"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                                    title="ลบงานออกจากระบบ"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => handleToggleComplete(task.id)}
                                    className="p-1 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors"
                                    title="สลับสถานะเสร็จงาน"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

              </motion.div>
            )}

            {/* ========================================== */}
            {/* VIEW B: PRIORITIZATION MATRIX              */}
            {/* ========================================== */}
            {activeTab === 'matrix' && (
              <motion.div
                key="matrix-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                
                {/* Visual Intro explaining Eisenhower categorization */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm leading-relaxed flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                    <Grid className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">หน้าวิเคราะห์จัดลำดับความสำคัญ (Eisenhower Matrix Method)</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ระบบจะวิเคราะห์คีย์เวิร์ดและเครื่องหมายความคืบหน้าที่คุณกรอกแยกออกเป็น 4 ขอบเขตอย่างชัดเจน เพื่อตอบปัญหา <strong className="text-slate-800">{"\"ควรเลือกเริ่มสางโครงการใดก่อน?\""}</strong> โดยกรองงานที่ทำสำเร็จแล้วความคืบหน้า 100% ออกเพื่อยึดพื้นที่โฟกัสงานค้าง
                    </p>
                  </div>
                </div>

                {/* 2X2 BENTO GRID REPRESENTATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* QUANDRANT 1: IMPORTANT & URGENT (DO FIRST) */}
                  <div className="bg-white rounded-2xl border border-rose-200/80 shadow-xs overflow-hidden flex flex-col min-h-[300px]">
                    <div className="bg-rose-50/50 border-b border-rose-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-rose-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                        <h4 className="font-semibold text-xs sm:text-sm font-display tracking-tight uppercase">สำคัญ และ เร่งด่วน (Do First)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-mono">
                        {matrixTasks.importantAndUrgent.length} งานค้าง
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3 bg-slate-50/30">
                      {matrixTasks.importantAndUrgent.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-12 italic font-sans">ไม่มีงานสำคัญเร่งด่วนในโซนนี้</p>
                      ) : (
                        matrixTasks.importantAndUrgent.map((t) => (
                          <div key={t.id} className="bg-white p-3 rounded-xl border border-zinc-100/90 shadow-2xs space-y-1.5 group hover:border-rose-300 transition-all">
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded block whitespace-nowrap">{t.project}</span>
                              <span className="text-[10px] font-bold text-rose-600 font-mono">⚠️ {computeCountdown(t.dueDate, false).text}</span>
                            </div>
                            <h5 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{t.title}</h5>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                              <span>👤 {t.assignee}</span>
                              <button onClick={() => handleStartEdit(t)} className="text-xs text-indigo-500 hover:underline">แก้ไข</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* QUANDRANT 2: URGENT BUT NOT IMPORTANT (DELEGATE/DO NEXT) */}
                  <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden flex flex-col min-h-[300px]">
                    <div className="bg-amber-50/50 border-b border-amber-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <h4 className="font-semibold text-xs sm:text-sm font-display tracking-tight uppercase">เร่งด่วน แต่ไม่สำคัญ (Do Next)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-mono">
                        {matrixTasks.urgentButNotImportant.length} งานค้าง
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3 bg-slate-50/30">
                      {matrixTasks.urgentButNotImportant.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-12 italic font-sans">ไม่มีงานเร่งด่วนในโซนนี้</p>
                      ) : (
                        matrixTasks.urgentButNotImportant.map((t) => (
                          <div key={t.id} className="bg-white p-3 rounded-xl border border-zinc-100/90 shadow-2xs space-y-1.5 group hover:border-amber-300 transition-all">
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded block whitespace-nowrap">{t.project}</span>
                              <span className="text-[10px] text-amber-600 font-mono">⏰ {computeCountdown(t.dueDate, false).text}</span>
                            </div>
                            <h5 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{t.title}</h5>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                              <span>👤 {t.assignee}</span>
                              <button onClick={() => handleStartEdit(t)} className="text-xs text-indigo-500 hover:underline">แก้ไข</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* QUANDRANT 3: IMPORTANT BUT NOT URGENT (PLAN / SCHEDULE) */}
                  <div className="bg-white rounded-2xl border border-indigo-200/80 shadow-xs overflow-hidden flex flex-col min-h-[300px]">
                    <div className="bg-indigo-50/50 border-b border-indigo-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-indigo-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                        <h4 className="font-semibold text-xs sm:text-sm font-display tracking-tight uppercase">สำคัญ แต่ไม่เร่งด่วน (Plan / Can Wait)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono">
                        {matrixTasks.importantButNotUrgent.length} งานค้าง
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3 bg-slate-50/30">
                      {matrixTasks.importantButNotUrgent.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-12 italic font-sans">ไม่มีงานสำคัญระบุกำหนดการณ์วางแผนแผนก</p>
                      ) : (
                        matrixTasks.importantButNotUrgent.map((t) => (
                          <div key={t.id} className="bg-white p-3 rounded-xl border border-zinc-100/90 shadow-2xs space-y-1.5 group hover:border-indigo-300 transition-all">
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded block whitespace-nowrap">{t.project}</span>
                              <span className="text-[10px] text-slate-500 font-mono">📅 {computeCountdown(t.dueDate, false).text}</span>
                            </div>
                            <h5 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{t.title}</h5>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                              <span>👤 {t.assignee}</span>
                              <button onClick={() => handleStartEdit(t)} className="text-xs text-indigo-500 hover:underline">แก้ไข</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* QUANDRANT 4: NOT IMPORTANT & NOT URGENT (CAN WAIT / GENERAL) */}
                  <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden flex flex-col min-h-[300px]">
                    <div className="bg-zinc-50 border-b border-zinc-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <h4 className="font-semibold text-xs sm:text-sm font-display tracking-tight uppercase">งานทั่วไป รอได้ (Can Wait / Leisure)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                        {matrixTasks.canWait.length} งานค้าง
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3 bg-slate-50/30">
                      {matrixTasks.canWait.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-12 italic font-sans">ไม่มีงานล่าช้าในกลุ่ม can wait ค้างดำเนินงาน</p>
                      ) : (
                        matrixTasks.canWait.map((t) => (
                          <div key={t.id} className="bg-white p-3 rounded-xl border border-zinc-100/90 shadow-2xs space-y-1.5 group hover:border-zinc-300 transition-all">
                            <div className="flex justify-between items-start gap-1">
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded block whitespace-nowrap">{t.project}</span>
                              <span className="text-[10px] text-slate-400 font-mono">🍃 {computeCountdown(t.dueDate, false).text}</span>
                            </div>
                            <h5 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{t.title}</h5>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                              <span>👤 {t.assignee}</span>
                              <button onClick={() => handleStartEdit(t)} className="text-xs text-indigo-500 hover:underline">แก้ไข</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* ========================================== */}
            {/* VIEW C: KANBAN BOARD WITH BOTTLENECKS     */}
            {/* ========================================== */}
            {activeTab === 'kanban' && (
              <motion.div
                key="kanban-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                
                {/* Visual Project Selector Strip exclusively for Kanban */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">ฟิลเตอร์โปรเจกต์กระดาน:</span>
                    <select
                      value={kanbanProjectFilter}
                      onChange={(e) => setKanbanProjectFilter(e.target.value)}
                      className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs bg-slate-50 font-sans font-medium cursor-pointer"
                    >
                      <option value="All">แสดงโครงการคละรวม (All Projects)</option>
                      {getUniqueProjects().map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                    <span>ลากการ์ดวางข้ามคอลัมน์เพื่ออัปเดตงานด่วนได้โดยตรง (Drag & Drop)</span>
                  </div>
                </div>

                {/* BOTTLENECK ACTIVE HAZARD SYSTEM (คอขวดสะสมงาน) */}
                {bottleneckInfo.inProgressBottleneck && (
                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-4 animate-shake">
                    <div className="p-2 bg-rose-500 text-white rounded-xl shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-rose-800 mb-0.5">⚠️ สัญญาณเตือนภาวะคอขวด (Workflow Bottleneck Warning!)</h4>
                      <p className="text-xs text-rose-700 leading-relaxed max-w-2xl">
                        ขณะนี้มีงานในสถานะ <strong>{"\"กำลังทำ (In Progress)\""}</strong> จำนวนรวมสะสมสูงกว่าปกติ ({bottleneckInfo.inProgressCount} งาน)! แนะนำให้คุณเคลียร์หรือกระจายงานเหล่านี้ให้เสร็จก่อนที่จะเอาโปรเจกต์ใหม่เข้าสู่การทำงานเพื่อการหมุนระบบที่มีประสิทธิผล
                      </p>
                    </div>
                  </div>
                )}

                {bottleneckInfo.reviewBottleneck && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4 animate-shake">
                    <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-amber-800 mb-0.5">⚠️ คอขวดที่ขั้นตอนตรวจสอบ (Review Queue Bottleneck!)</h4>
                      <p className="text-xs text-amber-700 leading-relaxed max-w-2xl">
                        ขณะนี้มีงานรอในขั้นตอน <strong>{"\"ตรวจสอบ (Review)\""}</strong> เยอะเกินไป ({bottleneckInfo.reviewCount} งาน)! แนะนำให้ผู้ดูแลโครงการหรือหัวหน้าทีมรีบตรวจสอบและกดยืนยันผ่านด่าน เพื่อไม่ให้งานล่าช้าสะสม
                      </p>
                    </div>
                  </div>
                )}

                {/* THE KANBAN COLUMNS SCREEN */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* COLUMN 1: NOT STARTED (ยังไม่เริ่ม) */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'not-started')}
                    className="bg-slate-100 rounded-2xl p-4 flex flex-col min-h-[450px] border border-slate-200/60"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">ยังไม่เริ่ม (Not Started)</h4>
                      </div>
                      <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                        {kanbanFilteredTasks('not-started').length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                      {kanbanFilteredTasks('not-started').length === 0 ? (
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-zinc-200/80 rounded-xl text-center text-xs text-slate-400 font-sans italic">
                          ไม่มีเป้าหมายคั่งค้าง
                        </div>
                      ) : (
                        kanbanFilteredTasks('not-started').map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="bg-white p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-300 shadow-3xs cursor-grab active:cursor-grabbing hover:shadow-2xs transition-all relative overflow-hidden group"
                          >
                            <span className="text-[9px] bg-slate-100 border border-zinc-200 px-1.5 py-0.5 rounded block w-max max-w-full truncate mb-1">
                              {task.project}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mb-1.5 pr-4 line-clamp-2">
                              {task.title}
                            </h5>
                            
                            <div className="text-[10px] text-slate-500 font-medium space-y-0.5 mb-2 font-mono">
                              <div>🏁 เริ่ม: {formatThaiBuddhistDate(task.startDate, task.startTime)}</div>
                              <div className="text-indigo-600 font-bold">🏁 ส่ง: {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                              <span className="truncate max-w-[120px]">👤 {task.assignee}</span>
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                                className="text-[10px] text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                              >
                                เริ่มเลย <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* COLUMN 2: IN PROGRESS (กำลังทำ) */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'in-progress')}
                    className={`rounded-2xl p-4 flex flex-col min-h-[450px] border transition-all ${
                      bottleneckInfo.inProgressBottleneck 
                        ? 'bg-rose-50/50 border-rose-200' 
                        : 'bg-indigo-50/30 border-indigo-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-indigo-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">กำลังทำ (In Progress)</h4>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        bottleneckInfo.inProgressBottleneck ? 'bg-rose-200 text-rose-800' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {kanbanFilteredTasks('in-progress').length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                      {kanbanFilteredTasks('in-progress').length === 0 ? (
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-zinc-200/80 rounded-xl text-center text-xs text-slate-400 font-sans italic">
                          ไม่มีงานความคืบหน้าปัจจุบัน
                        </div>
                      ) : (
                        kanbanFilteredTasks('in-progress').map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className={`bg-white p-3.5 rounded-xl border hover:shadow-2xs transition-all relative overflow-hidden group cursor-grab active:cursor-grabbing ${
                              bottleneckInfo.inProgressBottleneck ? 'border-rose-100 hover:border-rose-300' : 'border-zinc-200 hover:border-zinc-300'
                            }`}
                          >
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded block w-max max-w-full truncate mb-1">
                              {task.project}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mb-1 leading-snug line-clamp-2">
                              {task.title}
                            </h5>

                            {/* Mini progress state display */}
                            <div className="space-y-1 my-2">
                              <div className="flex justify-between items-center text-[9px] text-slate-400">
                                <span>คืบหน้า</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1">
                                <div className="bg-indigo-600 h-1 rounded-full" style={{ width: `${task.progress}%` }}></div>
                              </div>
                            </div>
                            
                            <div className="text-[10px] text-slate-500 font-medium space-y-0.5 mb-2 font-mono">
                              <div>⏱️ เริ่ม: {formatThaiBuddhistDate(task.startDate, task.startTime)}</div>
                              <div className="text-indigo-600 font-bold">🎯 ส่ง: {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                              <span className="truncate max-w-[100px]">👤 {task.assignee}</span>
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'review')}
                                className="text-[10px] text-amber-600 hover:underline font-semibold inline-flex items-center gap-0.5"
                              >
                                ส่งตรวจสอบ <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* COLUMN 3: REVIEW (ตรวจสอบ) */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'review')}
                    className={`rounded-2xl p-4 flex flex-col min-h-[450px] border transition-all ${
                      bottleneckInfo.reviewBottleneck
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'bg-amber-50/15 border-amber-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-amber-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">ตรวจสอบ (Review)</h4>
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        bottleneckInfo.reviewBottleneck ? 'bg-amber-200 text-amber-800' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {kanbanFilteredTasks('review').length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                      {kanbanFilteredTasks('review').length === 0 ? (
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-zinc-200/80 rounded-xl text-center text-xs text-slate-400 font-sans italic">
                          ไม่มีงานรอตรวจสอบ
                        </div>
                      ) : (
                        kanbanFilteredTasks('review').map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="bg-white p-3.5 rounded-xl border border-amber-100 hover:border-amber-300 shadow-3xs cursor-grab active:cursor-grabbing hover:shadow-2xs transition-all relative overflow-hidden group"
                          >
                            <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-1.5 py-0.5 rounded block w-max max-w-full truncate mb-1">
                              {task.project}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mb-1 leading-snug line-clamp-2">
                              {task.title}
                            </h5>

                            {/* Mini progress state display */}
                            <div className="space-y-1 my-2">
                              <div className="flex justify-between items-center text-[9px] text-slate-400">
                                <span>คืบหน้า</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-full h-1">
                                <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${task.progress}%` }}></div>
                              </div>
                            </div>
                            
                            <div className="text-[10px] text-slate-500 font-medium space-y-0.5 mb-2 font-mono">
                              <div>👀 เริ่ม: {formatThaiBuddhistDate(task.startDate, task.startTime)}</div>
                              <div className="text-amber-600 font-bold">🏁 ส่ง: {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                              <span className="truncate max-w-[100px]">👤 {task.assignee}</span>
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'completed')}
                                className="text-[10px] text-emerald-600 hover:underline font-semibold inline-flex items-center gap-0.5"
                              >
                                ผ่านการตรวจสอบ <Check className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* COLUMN 4: COMPLETED (เสร็จแล้ว) */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'completed')}
                    className="bg-emerald-50/20 rounded-2xl p-4 flex flex-col min-h-[450px] border border-emerald-100"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-emerald-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">เสร็จแล้ว (Completed)</h4>
                      </div>
                      <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        {kanbanFilteredTasks('completed').length}
                      </span>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
                      {kanbanFilteredTasks('completed').length === 0 ? (
                        <div className="h-40 flex items-center justify-center border-2 border-dashed border-zinc-200/80 rounded-xl text-center text-xs text-slate-400 font-sans italic">
                          ยังไม่มีงานเสร็จสิ้นย้ายเข้ามาวันนี้
                        </div>
                      ) : (
                        kanbanFilteredTasks('completed').map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="bg-white p-3.5 rounded-xl border border-emerald-100/80 hover:border-emerald-200 shadow-3xs cursor-grab active:cursor-grabbing hover:shadow-2xs transition-all relative overflow-hidden group opacity-85 hover:opacity-100"
                          >
                            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded block w-max max-w-full truncate mb-1">
                              {task.project}
                            </span>
                            <h5 className="text-xs font-bold text-slate-700 line-through mb-1.5 pr-4 line-clamp-2">
                              {task.title}
                            </h5>
                            
                            <div className="text-[10px] text-slate-400 font-medium space-y-0.5 mb-2 font-mono line-through opacity-70">
                              <div>✅ เริ่ม: {formatThaiBuddhistDate(task.startDate, task.startTime)}</div>
                              <div>✅ เสร็จ: {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                              <span className="truncate max-w-[120px]">👤 {task.assignee}</span>
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'review')}
                                className="text-[10px] text-amber-500 hover:underline"
                              >
                                ย้ายกลับตรวจสอบ
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {activeTab === 'table' && (
              <motion.div
                key="table-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Table View Header Status Filter Strip */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-indigo-600 animate-pulse" />
                        <span>ระบบตารางงานแบบละเอียด (Spreadsheet Table View)</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        แสดงข้อมูลงานทั้งหมดเป็นแถวตารางแบบกระชับ สามารถแก้ไขสถานะและระดับความคืบหน้าได้ทันทีจากแต่ละเรกคอร์ด
                      </p>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>คลิกเปลี่ยน <strong>สถานะ</strong> ในแถวตารางเพื่ออัปเดตงานแบบ Real-time ข้ามทุกแท็บทันที</span>
                    </div>
                  </div>

                  {/* Multi-Filter Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        กรองตามโครงการ (Project)
                      </label>
                      <select
                        value={kanbanProjectFilter}
                        onChange={(e) => setKanbanProjectFilter(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs bg-slate-50 cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="All">แสดงทุกโครงการ (All Projects)</option>
                        {getUniqueProjects().map((p, idx) => (
                          <option key={idx} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        กรองตามสถานะ (Status Group)
                      </label>
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          setTableStatusFilter(val);
                        }}
                        value={tableStatusFilter}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs bg-slate-50 cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="All">แสดงทุกสถานะ (All Statuses)</option>
                        <option value="not-started">🕒 ยังไม่เริ่ม (Not Started)</option>
                        <option value="in-progress">⏳ กำลังทำ (In Progress)</option>
                        <option value="review">👀 ตรวจสอบ (Review)</option>
                        <option value="revising">🚀 แก้ไข (Revising)</option>
                        <option value="disapproved">❌ ไม่อนุมัติ (Disapproved)</option>
                        <option value="completed">✅ เสร็จแล้ว (Completed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        กรองตามผู้รับผิดชอบ (Assignee)
                      </label>
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          setTableAssigneeFilter(val);
                        }}
                        value={tableAssigneeFilter}
                        className="w-full px-2.5 py-1.5 border border-zinc-200 rounded-lg text-xs bg-slate-50 cursor-pointer text-slate-700 font-medium"
                      >
                        <option value="All">แสดงทุกคน (All Assignees)</option>
                        {Array.from(new Set(tasks.map(t => t.assignee).filter(Boolean))).map((member, idx) => (
                          <option key={idx} value={member}>{member}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Spreadsheet Table Sheet */}
                <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-zinc-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                          <th className="py-3 px-4 min-w-[200px]">ชื่องานและระดับสำคัญ</th>
                          <th className="py-3 px-3 min-w-[120px]">โครงการ / หมวดหมู่</th>
                          <th className="py-3 px-3 min-w-[130px]">ผู้รับผิดชอบ</th>
                          <th className="py-3 px-3 min-w-[110px]">วันเริ่มต้น - ส่งมอบ</th>
                          <th className="py-3 px-3 min-w-[140px]">ความคืบหน้า (Progress)</th>
                          <th className="py-3 px-3 min-w-[150px]">สถานะการทำงาน (Status)</th>
                          <th className="py-3 px-4 text-right min-w-[100px]">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-xs text-slate-700">
                        {filteredTableTasks.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400 italic font-sans">
                              ❌ ไม่พบเกณฑ์ที่สอดคล้องกับตัวกรองของคุณ กรุณาลองปรับตัวกรอง หรือเพิ่มงานใหม่ทางด้านซ้าย
                            </td>
                          </tr>
                        ) : (
                          filteredTableTasks.map((task) => {
                            const statusObj = getWorkflowStatusDetails(task.status, task.progress);
                            const countdown = computeCountdown(task.dueDate, task.status === 'completed');
                            
                            return (
                              <tr key={task.id} className="hover:bg-slate-50/70 transition-colors">
                                {/* Task Title and Priority */}
                                <td className="py-3.5 px-4">
                                  <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-900 leading-snug hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => handleStartEdit(task)}>
                                      {task.title}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {task.isImportant && (
                                        <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded-md font-bold border border-rose-100 uppercase tracking-widest">
                                          🔥 Important
                                        </span>
                                      )}
                                      {task.isUrgent && (
                                        <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-bold border border-amber-100 uppercase tracking-widest">
                                          ⚡ Urgent
                                        </span>
                                      )}
                                      {!task.isImportant && !task.isUrgent && (
                                        <span className="text-[9px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-md border border-slate-100">
                                          General
                                        </span>
                                      )}
                                      {task.notes && (
                                        <span className="text-[10px] text-zinc-400 truncate max-w-[200px] block" title={task.notes}>
                                          📝 {task.notes}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Project & Category Badge */}
                                <td className="py-3.5 px-3">
                                  <div className="space-y-1">
                                    <span className="inline-block text-[10px] font-bold bg-indigo-50 border border-indigo-100/60 text-indigo-700 px-2 py-0.5 rounded-md max-w-[130px] truncate" title={task.project}>
                                      📂 {task.project}
                                    </span>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                      <Tag className="w-2.5 h-2.5 text-slate-300" />
                                      <span>{task.category}</span>
                                    </div>
                                  </div>
                                </td>

                                {/* Assignee */}
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 border border-zinc-200 text-[10px] flex items-center justify-center font-bold">
                                      {task.assignee ? task.assignee.charAt(0) : "U"}
                                    </div>
                                    <span className="truncate max-w-[100px]" title={task.assignee}>{task.assignee || 'ไม่ได้ระบุ'}</span>
                                  </div>
                                </td>

                                {/* Dates & Target Countdown */}
                                <td className="py-3.5 px-3 whitespace-nowrap">
                                  <div className="space-y-0.5 font-mono text-[10px]">
                                    <div className="text-slate-400">เริ่ม: {formatThaiBuddhistDate(task.startDate, task.startTime)}</div>
                                    <div className="text-slate-800 font-semibold mb-0.5">ส่ง: {formatThaiBuddhistDate(task.dueDate, task.dueTime)}</div>
                                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                      task.status === 'completed' 
                                        ? 'bg-green-50 text-green-600'
                                        : countdown.days < 0 
                                          ? 'bg-rose-50 text-rose-600' 
                                          : 'bg-indigo-50 text-indigo-600'
                                    }`}>
                                      {countdown.text}
                                    </span>
                                  </div>
                                </td>

                                {/* Interactive Progress Bar & Selector */}
                                <td className="py-3.5 px-3">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="text-slate-400">คืบหน้า:</span>
                                      <span className="font-bold text-slate-800">{task.progress}%</span>
                                    </div>
                                    
                                    {/* Slider to quickly slide progress */}
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      step="5"
                                      disabled={task.status === 'completed' || task.status === 'not-started'}
                                      value={task.progress}
                                      onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                                      className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600 cursor-pointer disabled:opacity-50"
                                    />
                                    
                                    {/* Small buttons to step +-10 */}
                                    {task.status !== 'completed' && task.status !== 'not-started' && (
                                      <div className="flex gap-1">
                                        <button 
                                          onClick={() => handleProgressChange(task.id, Math.max(0, task.progress - 10))}
                                          className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1 rounded transition-colors"
                                        >
                                          -10%
                                        </button>
                                        <button 
                                          onClick={() => handleProgressChange(task.id, Math.min(100, task.progress + 10))}
                                          className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-1 rounded transition-colors"
                                        >
                                          +10%
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </td>

                                {/* Direct Interactive Status Dropdown Selector */}
                                <td className="py-3.5 px-3">
                                  <select
                                    value={task.status}
                                    onChange={(e) => handleUpdateStatus(task.id, e.target.value as Task['status'])}
                                    className={`px-2 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer w-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                                      statusObj.color.includes('text-emerald') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                      statusObj.color.includes('text-rose') ? 'bg-rose-50 border-rose-200 text-rose-800' :
                                      statusObj.color.includes('text-amber') ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                      statusObj.color.includes('text-indigo') ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
                                      'bg-slate-50 border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <option value="not-started">🕒 ยังไม่เริ่ม (Not Started)</option>
                                    <option value="in-progress">⏳ กำลังทำ (In Progress)</option>
                                    <option value="review">👀 ตรวจสอบ (Review)</option>
                                    <option value="revising">🚀 แก้ไข (Revising)</option>
                                    <option value="disapproved">❌ ไม่อนุมัติ (Disapproved)</option>
                                    <option value="completed">✅ เสร็จแล้ว (Completed)</option>
                                  </select>
                                </td>

                                {/* Row Edit & Delete Actions */}
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => handleStartEdit(task)}
                                      className="p-1 px-2.5 rounded bg-zinc-50 border border-zinc-200/60 hover:border-zinc-300 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-all font-sans font-medium text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                      title="แก้ไขคุณสมบัติงานทั้งหมด"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span className="hidden sm:inline">แก้ไข</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1.5 rounded bg-zinc-50 border border-zinc-200/60 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                                      title="ลบงานนี้ถาวร"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer Stats Sum */}
                  <div className="bg-slate-50 p-3 px-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
                    <div>
                      <span>แสดงทั้งหมด <strong>{filteredTableTasks.length}</strong> แถว (จากทั้งหมด {tasks.length} แถวในระบบ)</span>
                    </div>

                    <div className="flex gap-4 flex-wrap justify-center sm:justify-end">
                      <span>🕒 {tasks.filter(t => t.status === 'not-started').length} ยังไม่เริ่ม</span>
                      <span>⏳ {tasks.filter(t => t.status === 'in-progress').length} กำลังทำ</span>
                      <span>👀 {tasks.filter(t => t.status === 'review').length} ตรวจสอบ</span>
                      <span>🚀 {tasks.filter(t => t.status === 'revising').length} แก้ไข</span>
                      <span>❌ {tasks.filter(t => t.status === 'disapproved').length} ไม่อนุมัติ</span>
                      <span>✅ {tasks.filter(t => t.status === 'completed').length} เสร็จแล้ว</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>

      </div>

    </div>
  );
}
