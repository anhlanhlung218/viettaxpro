
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Info, 
  ArrowRightLeft, 
  Users, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Building2,
  Wallet,
  Briefcase,
  FileText,
  HelpCircle,
  ArrowUpRight,
  ChevronRight,
  Calendar,
  Zap,
  Download,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { jsPDF } from 'jspdf';
import { Region, CalculationInputs, TaxResult } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calc' | 'compare' | 'annual'>('calc');
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const [compInputs, setCompInputs] = useState<CalculationInputs>({
    salary: 30000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const [bonus, setBonus] = useState<number>(25000000);

  const result = useMemo(() => {
    return inputs.isGrossToNet ? calculateGrossToNet(inputs) : calculateNetToGross(inputs);
  }, [inputs]);

  const compResult = useMemo(() => {
    return compInputs.isGrossToNet ? calculateGrossToNet(compInputs) : calculateNetToGross(compInputs);
  }, [compInputs]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = "PHIEU LUONG CHI TIET - VIETTAX PRO";
    const date = new Date().toLocaleDateString('vi-VN');

    doc.setFontSize(22);
    doc.text("VIETTAX PRO", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("He thong tinh toan thue TNCN thong minh", 105, 27, { align: 'center' });
    
    doc.line(20, 35, 190, 35);
    
    doc.setFontSize(14);
    doc.text("KET QUA PHAN TICH LUONG THANG", 20, 45);
    doc.setFontSize(10);
    doc.text(`Ngay xuat: ${date}`, 20, 52);

    let y = 65;
    const addLine = (label: string, value: string, isBold = false) => {
      if (isBold) doc.setFont("helvetica", "bold");
      else doc.setFont("helvetica", "normal");
      doc.text(label, 20, y);
      doc.text(value, 190, y, { align: 'right' });
      y += 8;
    };

    addLine("Luong Gross:", `${result.grossSalary.toLocaleString()} VND`, true);
    addLine("BHXH (8%):", `-${result.socialInsurance.toLocaleString()} VND`);
    addLine("BHYT (1.5%):", `-${result.healthInsurance.toLocaleString()} VND`);
    addLine("BHTN (1%):", `-${result.unemploymentInsurance.toLocaleString()} VND`);
    y += 2;
    addLine("Thu nhap truoc thue:", `${result.incomeBeforeTax.toLocaleString()} VND`, true);
    addLine("Giam tru gia canh (Ban than + Phu thuoc):", `-${(result.selfDeduction + result.dependentDeduction).toLocaleString()} VND`);
    y += 2;
    addLine("Thu nhap tinh thue:", `${result.taxableIncome.toLocaleString()} VND`, true);
    addLine("Thue TNCN phai nop:", `-${result.personalIncomeTax.toLocaleString()} VND`);
    y += 5;
    doc.setFontSize(16);
    addLine("LUONG THUC NHAN (NET):", `${result.netSalary.toLocaleString()} VND`, true);
    
    y += 15;
    doc.setFontSize(14);
    doc.text("CHI TIET CAC BAC THUE", 20, y);
    y += 10;
    doc.setFontSize(10);
    result.taxSteps.forEach(step => {
      addLine(`Bac ${step.level} (${step.rate}%):`, `${step.amount.toLocaleString()} VND`);
    });

    if (result.taxSteps.length === 0) {
      doc.text("Chua den nguong chiu thue TNCN.", 20, y);
    }

    doc.setFontSize(8);
    doc.text("Tai lieu nay chi mang tinh chat tham khao.", 105, 280, { align: 'center' });
    
    doc.save(`VietTax_Pro_Bao_Cao_${inputs.salary}.pdf`);
  };

  const chartData = [
    { name: 'Lương Net', value: result.netSalary },
    { name: 'Bảo hiểm', value: result.socialInsurance + result.healthInsurance + result.unemploymentInsurance },
    { name: 'Thuế TNCN', value: result.personalIncomeTax },
  ];

  const compareChartData = [
    { 
      name: 'Phương án 1', 
      net: result.netSalary, 
      tax: result.personalIncomeTax, 
      ins: result.socialInsurance + result.healthInsurance + result.unemploymentInsurance 
    },
    { 
      name: 'Phương án 2', 
      net: compResult.netSalary, 
      tax: compResult.personalIncomeTax, 
      ins: compResult.socialInsurance + compResult.healthInsurance + compResult.unemploymentInsurance 
    },
  ];

  const annualProjectionData = Array.from({ length: 12 }, (_, i) => ({
    month: `Tháng ${i + 1}`,
    net: result.netSalary + (i === 11 ? bonus : 0),
    tax: result.personalIncomeTax,
    savings: (result.netSalary * 0.3) * (i + 1)
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">VietTax Pro</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pháp lý & Tài chính 2024</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('calc')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'calc' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Máy tính thuế
            </button>
            <button 
              onClick={() => setActiveTab('compare')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'compare' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              So sánh lương
            </button>
            <button 
              onClick={() => setActiveTab('annual')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'annual' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Kế hoạch năm
            </button>
          </nav>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-xs font-black">
            <Zap className="w-3.5 h-3.5 fill-current" />
            V.2.5 PREMIUM
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-700">
        
        {activeTab === 'calc' && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                    Cấu hình lương
                  </h2>
                  <button 
                    onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all border border-slate-100"
                    title="Đổi chiều tính toán"
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Mức lương {inputs.isGrossToNet ? '(Gross)' : '(Net)'}
                    </label>
                    <div className="relative group">
                      <input 
                        type="number" 
                        value={inputs.salary}
                        onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                        className="w-full pl-6 pr-12 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-2xl font-black text-slate-800"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300 group-focus-within:text-indigo-500 transition-colors">₫</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Người phụ thuộc</label>
                      <select 
                        value={inputs.dependents}
                        onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
                      >
                        {[0,1,2,3,4,5,6,7,8,9].map(v => <option key={v} value={v}>{v} người</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Vùng tối thiểu</label>
                      <select 
                        value={inputs.region}
                        onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                        className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-slate-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
                      >
                        {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Lương đóng bảo hiểm
                      <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setInputs(p => ({ ...p, insuranceSalary: 'full' }))}
                        className={`py-4 rounded-2xl text-xs font-black transition-all border-2 ${inputs.insuranceSalary === 'full' ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                      >
                        FULL LƯƠNG
                      </button>
                      <button 
                        onClick={() => setInputs(p => ({ ...p, insuranceSalary: inputs.salary }))}
                        className={`py-4 rounded-2xl text-xs font-black transition-all border-2 ${inputs.insuranceSalary !== 'full' ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                      >
                        TÙY CHỈNH
                      </button>
                    </div>
                    {inputs.insuranceSalary !== 'full' && (
                      <input 
                        type="number"
                        placeholder="Mức đóng..."
                        value={typeof inputs.insuranceSalary === 'number' ? inputs.insuranceSalary : ''}
                        onChange={(e) => setInputs(p => ({ ...p, insuranceSalary: Number(e.target.value) }))}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold animate-in slide-in-from-top-1"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Legal Info Card */}
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  Quy định 2024
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center text-slate-400 border-b border-white/10 pb-3">
                    <span className="font-medium">Lương cơ sở</span>
                    <span className="font-black text-white">2.340.000₫</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 border-b border-white/10 pb-3">
                    <span className="font-medium">Giảm trừ bản thân</span>
                    <span className="font-black text-white">11.000.000₫</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 pb-1">
                    <span className="font-medium">Giảm trừ phụ thuộc</span>
                    <span className="font-black text-white">4.400.000₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Column */}
            <div className="lg:col-span-8 space-y-8">
              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Wallet className="w-16 h-16 text-emerald-600" />
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 tracking-wider">
                    Lương Thực Nhận (Net)
                  </div>
                  <div className="text-5xl font-black text-slate-900 leading-none">
                    {result.netSalary.toLocaleString()}<span className="text-2xl text-slate-300 ml-2 font-bold">₫</span>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-sm">
                    <TrendingUp className="w-4 h-4" />
                    Tỷ lệ: {((result.netSalary/result.grossSalary)*100).toFixed(1)}% Lương Gross
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-10 relative overflow-hidden">
                   <div className="bg-rose-100 text-rose-700 w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-6 tracking-wider">
                    Nghĩa vụ Tài chính
                   </div>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">Thuế TNCN</span>
                        <span className="text-2xl font-black text-rose-600">{result.personalIncomeTax.toLocaleString()}₫</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold text-sm uppercase tracking-wide">Bảo hiểm</span>
                        <span className="text-2xl font-black text-blue-600">{(result.socialInsurance + result.healthInsurance + result.unemploymentInsurance).toLocaleString()}₫</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Employer Cost Widget */}
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <Building2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">Chi phí Doanh nghiệp</h2>
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">Tổng quỹ lương công ty chi trả</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Tổng cộng (Cost to Company)</p>
                    <p className="text-3xl font-black">{result.totalEmployerCost.toLocaleString()}₫</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-indigo-300 font-black uppercase mb-2">BHXH (17.5%)</p>
                    <p className="text-xl font-black">{result.employerSocialIns.toLocaleString()}₫</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-indigo-300 font-black uppercase mb-2">BHYT (3%)</p>
                    <p className="text-xl font-black">{result.employerHealthIns.toLocaleString()}₫</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-indigo-300 font-black uppercase mb-2">BHTN (1%)</p>
                    <p className="text-xl font-black">{result.employerUnemploymentIns.toLocaleString()}₫</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                    <p className="text-[10px] text-indigo-300 font-black uppercase mb-2">KPCĐ (2%)</p>
                    <p className="text-xl font-black">{result.employerTradeUnion.toLocaleString()}₫</p>
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500" />
                    Chi tiết bảng lương tháng
                  </h3>
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 text-indigo-600 text-xs font-black hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100"
                  >
                    XUẤT PHIẾU LƯƠNG PDF <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-10">
                  <div className="space-y-5 text-sm font-bold">
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-slate-400 uppercase tracking-widest text-[11px]">Lương Gross Niêm Yết</span>
                      <span className="text-xl font-black text-slate-900">{result.grossSalary.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-slate-400 uppercase tracking-widest text-[11px]">Bảo hiểm Xã hội (8%)</span>
                      <span className="text-rose-600">-{result.socialInsurance.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-slate-400 uppercase tracking-widest text-[11px]">Bảo hiểm Y tế (1.5%)</span>
                      <span className="text-rose-600">-{result.healthInsurance.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-slate-400 uppercase tracking-widest text-[11px]">Bảo hiểm Thất nghiệp (1%)</span>
                      <span className="text-rose-600">-{result.unemploymentInsurance.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-5 bg-slate-50 px-6 rounded-2xl border border-slate-100 my-4">
                      <span className="text-slate-800 font-black uppercase tracking-wider">Thu nhập trước thuế</span>
                      <span className="text-lg font-black">{result.incomeBeforeTax.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-slate-50">
                      <span className="text-slate-400 italic">Tổng mức giảm trừ gia cảnh:</span>
                      <span className="text-emerald-600 font-black">-{(result.selfDeduction + result.dependentDeduction).toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-5 bg-indigo-50 px-6 rounded-2xl border border-indigo-100 my-4">
                      <span className="text-indigo-800 font-black uppercase tracking-wider">Thu nhập tính thuế</span>
                      <span className="text-lg font-black text-indigo-700">{result.taxableIncome.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <span className="text-slate-400 uppercase tracking-widest text-[11px]">Thuế TNCN phải nộp</span>
                      <span className="text-2xl font-black text-rose-600">-{result.personalIncomeTax.toLocaleString()}₫</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progressive Tax Explanation */}
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-10">
                <h3 className="text-xl font-black mb-10 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-indigo-500" />
                  Diễn giải Thuế suất theo Bậc
                </h3>
                <div className="grid gap-4">
                  {result.taxSteps.map(step => (
                    <div key={step.level} className="flex items-center gap-6 bg-slate-50/80 p-6 rounded-3xl border border-slate-100 hover:bg-slate-50 hover:border-indigo-100 transition-all group">
                      <div className="w-14 h-14 bg-white shadow-sm rounded-2xl flex items-center justify-center font-black text-xl text-indigo-600 border border-slate-200 group-hover:scale-105 transition-transform">
                        {step.level}
                      </div>
                      <div className="flex-grow">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{step.range}</p>
                        <p className="text-base font-black text-slate-700">Thuế suất {step.rate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-slate-900">{step.amount.toLocaleString()}₫</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Phải nộp</p>
                      </div>
                    </div>
                  ))}
                  {result.taxSteps.length === 0 && (
                    <div className="p-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-black italic">Mức thu nhập của bạn chưa đến ngưỡng chịu thuế TNCN.</p>
                      <p className="text-xs text-slate-300 mt-2 font-bold uppercase">Ngưỡng chịu thuế từ 11.000.000₫ trở lên (đối với cá nhân không có người phụ thuộc)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Tax System Explanation Section */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2.5rem] border border-slate-200 p-12 space-y-12">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Hiểu về Hệ thống Thuế Lũy tiến Việt Nam</h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Cách nhà nước tính toán nghĩa vụ thuế của bạn</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="font-black text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      Tại sao lại là "Lũy tiến"?
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      Thuế lũy tiến từng phần nghĩa là mức thuế suất sẽ tăng dần theo từng bậc thu nhập. Thay vì đánh thuế một tỷ lệ cố định trên toàn bộ số tiền, thu nhập của bạn được chia nhỏ vào các "giỏ" (bậc), mỗi giỏ có một mức thuế riêng. 
                      <br /><br />
                      Hệ thống này giúp đảm bảo sự công bằng: người có thu nhập thấp đóng ít hơn, và người có thu nhập cao đóng góp nhiều hơn cho ngân sách nhà nước.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="font-black text-slate-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-indigo-500" />
                      Quy trình 3 bước tính toán
                    </h3>
                    <ul className="space-y-4">
                      {[
                        { step: "01", title: "Khấu trừ Bảo hiểm", desc: "Trừ 10.5% lương (BHXH, BHYT, BHTN) để lấy Thu nhập trước thuế." },
                        { step: "02", title: "Giảm trừ Gia cảnh", desc: "Trừ 11tr (bản thân) và 4.4tr (mỗi người phụ thuộc) để lấy Thu nhập tính thuế." },
                        { step: "03", title: "Áp dụng Biểu thuế", desc: "Chia nhỏ Thu nhập tính thuế vào 7 bậc để tính tổng tiền thuế." }
                      ].map(i => (
                        <li key={i.step} className="flex gap-4 items-start">
                          <span className="text-lg font-black text-indigo-200">{i.step}</span>
                          <div>
                            <p className="text-sm font-black text-slate-700">{i.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{i.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8">
                  <h3 className="font-black text-indigo-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-wider">
                    Ví dụ minh họa thực tế (Mức lương 30,000,000đ)
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="text-indigo-400 font-bold text-[10px] uppercase">Phần 1: Khấu trừ</p>
                      <p className="text-slate-600 font-medium">• BHXH: 2,400,000đ (8%)</p>
                      <p className="text-slate-600 font-medium">• BHYT: 450,000đ (1.5%)</p>
                      <p className="text-slate-600 font-medium">• BHTN: 300,000đ (1%)</p>
                      <p className="text-indigo-700 font-black mt-2">Còn lại: 26,850,000đ</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-indigo-400 font-bold text-[10px] uppercase">Phần 2: Giảm trừ (0 NPT)</p>
                      <p className="text-slate-600 font-medium">• Bản thân: 11,000,000đ</p>
                      <p className="text-slate-600 font-medium">• Phụ thuộc: 0đ</p>
                      <div className="h-4"></div>
                      <p className="text-indigo-700 font-black mt-2">Thu nhập tính thuế: 15,850,000đ</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-indigo-400 font-bold text-[10px] uppercase">Phần 3: Phân bậc thuế</p>
                      <p className="text-slate-600 font-medium">• 5tr đầu (5%): 250,000đ</p>
                      <p className="text-slate-600 font-medium">• 5tr tiếp (10%): 500,000đ</p>
                      <p className="text-slate-600 font-medium">• 5.85tr còn lại (15%): 877,500đ</p>
                      <p className="text-rose-600 font-black mt-2">Tổng thuế: 1,627,500đ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200"></div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-wider">PHƯƠNG ÁN A</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mức lương mong muốn</label>
                    <input 
                      type="number" 
                      value={inputs.salary}
                      onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                      className="w-full text-3xl font-black p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Thực nhận (Net)</p>
                      <p className="text-2xl font-black text-emerald-800">{result.netSalary.toLocaleString()}₫</p>
                    </div>
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl">
                      <p className="text-[10px] font-black text-rose-600 uppercase mb-2">Tiền Thuế</p>
                      <p className="text-2xl font-black text-rose-800">{result.personalIncomeTax.toLocaleString()}₫</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm space-y-8 hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-200"></div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-wider">PHƯƠNG ÁN B</h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mức lương mong muốn</label>
                    <input 
                      type="number" 
                      value={compInputs.salary}
                      onChange={(e) => setCompInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                      className="w-full text-3xl font-black p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-purple-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl">
                      <p className="text-[10px] font-black text-emerald-600 uppercase mb-2">Thực nhận (Net)</p>
                      <p className="text-2xl font-black text-emerald-800">{compResult.netSalary.toLocaleString()}₫</p>
                    </div>
                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl">
                      <p className="text-[10px] font-black text-rose-600 uppercase mb-2">Tiền Thuế</p>
                      <p className="text-2xl font-black text-rose-800">{compResult.personalIncomeTax.toLocaleString()}₫</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="text-2xl font-black text-slate-800">Biểu đồ So sánh Trực quan</h3>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> LƯƠNG NET
                      </div>
                      <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                        <div className="w-3 h-3 bg-rose-500 rounded-full"></div> THUẾ TNCN
                      </div>
                   </div>
                </div>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={compareChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontWeight: '900', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontWeight: '700', fontSize: 10}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="net" fill="#10b981" name="Lương Net" radius={[12, 12, 12, 12]} barSize={80} />
                      <Bar dataKey="tax" fill="#ef4444" name="Thuế TNCN" radius={[12, 12, 12, 12]} barSize={80} />
                      <Bar dataKey="ins" fill="#3b82f6" name="Bảo hiểm" radius={[12, 12, 12, 12]} barSize={80} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative">
                   <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>
                   <div className="text-center md:text-left">
                      <p className="text-slate-500 font-black text-[11px] uppercase tracking-widest mb-2">Chênh lệch thu nhập hàng tháng</p>
                      <p className="text-4xl font-black">
                        {Math.abs(result.netSalary - compResult.netSalary).toLocaleString()}₫
                      </p>
                   </div>
                   <div className="h-px w-20 bg-white/10 hidden md:block"></div>
                   <div className="text-center md:text-right">
                      <p className="text-slate-500 font-black text-[11px] uppercase tracking-widest mb-2">Chênh lệch lũy kế cả năm</p>
                      <p className="text-4xl font-black text-indigo-400">
                        {Math.abs(result.netSalary - compResult.netSalary) * 12.toLocaleString()}₫
                      </p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'annual' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-500">
             <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
                  <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-xl shadow-indigo-100">
                    <Calendar className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800">Tầm nhìn Tài chính Năm</h2>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Dự phóng thu nhập và tích lũy dài hạn</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 space-y-8">
                       <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Thưởng (Tháng 13 / KPI)</p>
                          <div className="relative">
                            <input 
                              type="number"
                              value={bonus}
                              onChange={(e) => setBonus(Number(e.target.value))}
                              placeholder="Nhập mức thưởng..."
                              className="w-full text-2xl font-black p-5 bg-white border-2 border-slate-200 rounded-2xl outline-none focus:border-indigo-500 transition-all"
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-300">₫</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-4 italic font-medium leading-relaxed">
                            * Công cụ giả định tiền thưởng nhận vào tháng cuối năm và tính gộp thu nhập.
                          </p>
                       </div>
                       
                       <div className="grid gap-4">
                          <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                             <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Tổng Thực Nhận Năm</p>
                             <p className="text-4xl font-black">{(result.netSalary * 12 + bonus).toLocaleString()}₫</p>
                          </div>
                          <div className="p-8 bg-slate-900 rounded-[2rem] text-white">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổng Nghĩa vụ Thuế Năm</p>
                             <p className="text-4xl font-black">{(result.personalIncomeTax * 12).toLocaleString()}₫</p>
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-8">
                       <div className="bg-slate-50/50 rounded-[2.5rem] border border-slate-100 p-10 h-full">
                          <h3 className="font-black text-slate-800 mb-8 uppercase tracking-wider text-sm">Biểu đồ Tăng trưởng & Tiết kiệm Dự kiến</h3>
                          <div className="h-80">
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={annualProjectionData}>
                                  <defs>
                                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontWeight: '700', fontSize: 10}} />
                                  <YAxis hide />
                                  <Tooltip />
                                  <Area type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorNet)" />
                                  <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                                </AreaChart>
                             </ResponsiveContainer>
                          </div>
                          <div className="mt-8 flex items-center justify-center gap-8">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                               <div className="w-8 h-1 bg-indigo-500 rounded-full"></div> Dòng tiền hàng tháng
                             </div>
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
                               <div className="w-8 h-1 bg-emerald-500 rounded-full"></div> Lũy kế tiết kiệm (30%)
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
             </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
             <div className="col-span-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-slate-800 p-2 rounded-xl text-white shadow-lg">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">VietTax Pro</h2>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                  Giải pháp tính toán thuế TNCN chuyên sâu dành cho Người Lao Động và Doanh Nghiệp tại Việt Nam. Độ chính xác 99.9% dựa trên các quy định pháp luật mới nhất.
                </p>
                <div className="mt-8 flex gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center justify-center">
                      <HelpCircle className="w-5 h-5" />
                   </div>
                </div>
             </div>
             <div>
                <h4 className="font-black mb-8 text-[11px] uppercase tracking-[0.2em] text-slate-400">Tài nguyên</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600">
                  <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Biểu thuế lũy tiến</li>
                  <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Tra cứu MST cá nhân</li>
                  <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Văn bản pháp luật</li>
                </ul>
             </div>
             <div>
                <h4 className="font-black mb-8 text-[11px] uppercase tracking-[0.2em] text-slate-400">Hỗ trợ</h4>
                <ul className="space-y-4 text-sm font-bold text-slate-600">
                  <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Điều khoản dịch vụ</li>
                  <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Chính sách bảo mật</li>
                  <li className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Liên hệ hợp tác</li>
                </ul>
             </div>
          </div>
          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">© 2024 VIETTAX PRO SYSTEMS. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 tracking-widest">
                  <ShieldCheck className="w-4 h-4 fill-indigo-50" />
                  VERIFIED 2024
               </div>
               <div className="w-px h-4 bg-slate-200"></div>
               <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Design for Excellence</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
