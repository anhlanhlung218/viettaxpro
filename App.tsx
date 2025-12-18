
import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  ArrowRightLeft, 
  ShieldCheck, 
  TrendingUp,
  CreditCard,
  Wallet,
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  Shield,
  Zap,
  ChevronRight,
  Info
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Region, CalculationInputs } from './types';
import { calculateGrossToNet, calculateNetToGross } from './utils/taxCalculator';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    salary: 25000000,
    dependents: 0,
    region: Region.REGION_1,
    isGrossToNet: true,
    insuranceSalary: 'full'
  });

  const result = useMemo(() => {
    return inputs.isGrossToNet ? calculateGrossToNet(inputs) : calculateNetToGross(inputs);
  }, [inputs]);

  // Hàm định dạng tiền tệ với dấu chấm phân cách hàng nghìn
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("VIETTAX PRO - BAO CAO CHI TIET", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("He thong tinh thue TNCN tu dong", 105, 27, { align: 'center' });
    doc.line(20, 35, 190, 35);
    
    let y = 50;
    const addLine = (label: string, value: string) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, y);
      doc.text(value, 190, y, { align: 'right' });
      y += 10;
    };

    addLine("Luong Gross:", `${formatVND(result.grossSalary)} VND`);
    addLine("Bao hiem (10.5%):", `-${formatVND(result.socialInsurance + result.healthInsurance + result.unemploymentInsurance)} VND`);
    addLine("Giam tru gia canh:", `-${formatVND(result.selfDeduction + result.dependentDeduction)} VND`);
    addLine("Thue TNCN:", `-${formatVND(result.personalIncomeTax)} VND`);
    y += 10;
    doc.setFontSize(16);
    doc.text("LUONG THUC NHAN (NET):", 20, y);
    doc.text(`${formatVND(result.netSalary)} VND`, 190, y, { align: 'right' });
    
    doc.save(`VietTaxPro_Bao_Cao_${formatVND(result.netSalary)}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-['Inter'] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header Chuyên nghiệp */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100 z-[100]">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Calculator className="w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800">VietTax Pro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => scrollToSection('tool')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Công cụ</button>
            <button onClick={() => scrollToSection('knowledge')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Kiến thức</button>
            <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Tính năng</button>
          </div>

          <button 
            onClick={() => scrollToSection('tool')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100"
          >
            Tính ngay
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent -z-10"></div>
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-50 text-indigo-600 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm animate-bounce-slow">
            <Zap className="w-3.5 h-3.5 fill-indigo-500" /> Cập nhật quy định 2024 - 2025
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
            Giao diện tính thuế <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Đơn giản & Chính xác.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Mọi phép tính lương Net/Gross, bảo hiểm và thuế lũy tiến được xử lý ngay trong một trang duy nhất. Trải nghiệm sự minh bạch trong tài chính cá nhân.
          </p>
          <button 
            onClick={() => scrollToSection('tool')}
            className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-black hover:bg-indigo-600 transition-all shadow-2xl"
          >
            Bắt đầu ngay <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Tool & Result Section - Khu vực chính */}
      <section id="tool" className="py-20 container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Cấu hình Input */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-10 sticky top-32">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Cấu hình lương</h3>
                <button 
                  onClick={() => setInputs(p => ({ ...p, isGrossToNet: !p.isGrossToNet }))}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4" /> {inputs.isGrossToNet ? 'Gross → Net' : 'Net → Gross'}
                </button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-widest flex justify-between">
                    Mức lương hàng tháng
                    <span className="text-indigo-500">{inputs.isGrossToNet ? 'Gross' : 'Net'}</span>
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      value={inputs.salary}
                      onChange={(e) => setInputs(p => ({ ...p, salary: Number(e.target.value) }))}
                      className="w-full pl-8 pr-16 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-3xl font-black text-slate-800"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 group-focus-within:text-indigo-500 transition-colors">₫</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Người phụ thuộc</label>
                    <div className="relative">
                      <select 
                        value={inputs.dependents}
                        onChange={(e) => setInputs(p => ({ ...p, dependents: Number(e.target.value) }))}
                        className="w-full appearance-none px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-700 cursor-pointer"
                      >
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v} người</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vùng tối thiểu</label>
                    <div className="relative">
                      <select 
                        value={inputs.region}
                        onChange={(e) => setInputs(p => ({ ...p, region: e.target.value as Region }))}
                        className="w-full appearance-none px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-slate-700 cursor-pointer"
                      >
                        {Object.values(Region).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Pháp lý hiện hành</span>
                  </div>
                  <div className="space-y-3 text-[13px] font-medium text-slate-400">
                    <div className="flex justify-between"><span>Giảm trừ bản thân:</span> <span className="text-white font-black">11.000.000 ₫</span></div>
                    <div className="flex justify-between"><span>Mỗi người phụ thuộc:</span> <span className="text-white font-black">4.400.000 ₫</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hiển thị kết quả */}
          <div className="lg:col-span-7 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><Wallet className="w-20 h-20" /></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Lương thực nhận (Net)</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{formatVND(result.netSalary)}</span>
                  <span className="text-xl font-bold text-slate-300">₫</span>
                </div>
                <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" /> Tỷ lệ {((result.netSalary / result.grossSalary) * 100).toFixed(1)}% Gross
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform"><CreditCard className="w-20 h-20" /></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Thuế TNCN tạm tính</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-rose-600 tracking-tighter">{formatVND(result.personalIncomeTax)}</span>
                  <span className="text-xl font-bold text-rose-200">₫</span>
                </div>
                <div className="mt-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Theo biểu thuế lũy tiến</div>
              </div>
            </div>

            {/* Phân tích Chi tiết */}
            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Chi tiết bảng lương</h3>
                  <p className="text-slate-400 text-sm font-medium">Bóc tách từng khoản khấu trừ theo quy định</p>
                </div>
                <button 
                  onClick={handleExportPDF}
                  className="bg-slate-50 text-slate-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-slate-200 flex items-center gap-3"
                >
                  <Download className="w-4 h-4" /> Xuất báo cáo PDF
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Lương Gross niêm yết", val: result.grossSalary, sub: "Tổng thu nhập từ doanh nghiệp", type: 'neutral' },
                  { label: "Bảo hiểm Xã hội (8%)", val: -result.socialInsurance, sub: "Quỹ hưu trí và tử tuất", type: 'deduction' },
                  { label: "Bảo hiểm Y tế (1.5%)", val: -result.healthInsurance, sub: "Chăm sóc sức khỏe cộng đồng", type: 'deduction' },
                  { label: "Bảo hiểm Thất nghiệp (1%)", val: -result.unemploymentInsurance, sub: "Trợ cấp khi mất việc", type: 'deduction' },
                  { label: "Thu nhập trước thuế", val: result.incomeBeforeTax, sub: "Gross trừ các loại bảo hiểm", type: 'highlight', isTotal: true },
                  { label: "Giảm trừ gia cảnh", val: -(result.selfDeduction + result.dependentDeduction), sub: "Bản thân & Người phụ thuộc", type: 'deduction' },
                  { label: "Thu nhập tính thuế", val: result.taxableIncome, sub: "Cơ sở để áp dụng bậc thuế", type: 'highlight' },
                  { label: "Thuế thu nhập cá nhân", val: -result.personalIncomeTax, sub: "Nghĩa vụ với ngân sách nhà nước", type: 'tax' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-5 rounded-2xl transition-colors hover:bg-slate-50/50 ${item.isTotal ? 'bg-slate-50 border border-slate-100 my-4' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-1.5 rounded-lg ${item.type === 'deduction' ? 'bg-rose-50 text-rose-500' : item.type === 'highlight' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-500'}`}>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                      <div>
                        <p className={`text-sm font-black ${item.type === 'tax' ? 'text-rose-600' : 'text-slate-800'}`}>{item.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
                      </div>
                    </div>
                    <p className={`text-lg font-black ${item.val < 0 ? 'text-rose-600' : item.type === 'highlight' ? 'text-indigo-600' : 'text-slate-900'}`}>
                      {item.val < 0 ? '-' : ''}{formatVND(Math.abs(item.val))} <span className="text-xs font-bold text-slate-300 ml-1">₫</span>
                    </p>
                  </div>
                ))}

                <div className="mt-10 p-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-100 mb-2">Số tiền thực nhận</p>
                      <h4 className="text-3xl font-black tracking-tight">Lương Net của bạn</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black">{formatVND(result.netSalary)}</span>
                      <span className="text-xl font-bold text-indigo-200 ml-2">₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kiến thức Thuế - Section bên dưới */}
      <section id="knowledge" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black text-slate-900 mb-6">Biểu thuế lũy tiến là gì?</h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Tại Việt Nam, thu nhập không bị tính thuế một lần. Hệ thống chia nhỏ tiền của bạn thành từng "bậc". 
                Người có thu nhập thấp đóng ít hơn, người thu nhập cao đóng nhiều hơn để đảm bảo công bằng.
              </p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <Info className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quy định 2024</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              {[
                { level: 1, range: "Đến 5 triệu VNĐ", rate: "5%" },
                { level: 2, range: "Trên 5 đến 10 triệu VNĐ", rate: "10%" },
                { level: 3, range: "Trên 10 đến 18 triệu VNĐ", rate: "15%" },
                { level: 4, range: "Trên 18 đến 32 triệu VNĐ", rate: "20%" },
                { level: 5, range: "Trên 32 đến 52 triệu VNĐ", rate: "25%" },
                { level: 6, range: "Trên 52 đến 80 triệu VNĐ", rate: "30%" },
                { level: 7, range: "Trên 80 triệu VNĐ", rate: "35%" },
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {step.level}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{step.range}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Phần thu nhập chịu thuế</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-indigo-600">{step.rate}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8 sticky top-32">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <BookOpen className="w-7 h-7 text-indigo-400" />
                  Ví dụ dễ hiểu
                </h3>
                <div className="space-y-6 text-slate-400 font-medium leading-relaxed">
                  <p>Giả sử thu nhập tính thuế của bạn là <strong className="text-white">12 triệu VNĐ</strong>:</p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <span className="text-indigo-400 font-black">Bậc 1:</span>
                      <span>5 triệu đầu tính thuế 5% = <span className="text-white">250.000₫</span></span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-indigo-400 font-black">Bậc 2:</span>
                      <span>5 triệu tiếp theo tính thuế 10% = <span className="text-white">500.000₫</span></span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-indigo-400 font-black">Bậc 3:</span>
                      <span>2 triệu còn lại tính thuế 15% = <span className="text-white">300.000₫</span></span>
                    </li>
                  </ul>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm uppercase tracking-widest font-black">Tổng thuế:</span>
                    <span className="text-2xl font-black text-indigo-400">1.050.000₫</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-900 mb-6">An tâm tính toán</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Shield className="w-7 h-7" />, title: "Bảo mật trình duyệt", desc: "Dữ liệu lương của bạn không bao giờ rời khỏi máy tính cá nhân. Chúng tôi không lưu trữ thông tin." },
            { icon: <CheckCircle2 className="w-7 h-7" />, title: "Dữ liệu chính xác", desc: "Mọi thông số về giảm trừ gia cảnh và bảo hiểm được cập nhật theo Nghị quyết mới nhất của Quốc hội." },
            { icon: <ShieldCheck className="w-7 h-7" />, title: "Xác thực bởi chuyên gia", desc: "Công thức được kiểm chứng bởi đội ngũ kế toán thuế dày dặn kinh nghiệm tại Việt Nam." }
          ].map((f, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all space-y-6">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                {f.icon}
              </div>
              <h4 className="text-xl font-black text-slate-900">{f.title}</h4>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 p-2 rounded-xl text-white">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-800">VietTax Pro</span>
            </div>
            <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase">© 2024 Nền tảng tính thuế thông minh cho người Việt.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xs font-black text-slate-500 hover:text-indigo-600 uppercase tracking-widest">Trở lên đầu</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
