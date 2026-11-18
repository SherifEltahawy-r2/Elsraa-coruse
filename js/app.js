const appState = {
  language: localStorage.getItem('al_israa_lang') || 'ar',
  theme: localStorage.getItem('al_israa_theme') || 'dark',
  client: null,
  user: null,
  profile: null,
  courses: [],
  announcements: [],
  announcementReads: new Set(),
  adminNotifications: [],
  siteSettings: {},
};

const textMap = {
  'الرئيسية': 'Home',
  'المقررات': 'Courses',
  'المجتمع': 'Community',
  'لوحة الطالب': 'Student dashboard',
  'تسجيل الدخول': 'Sign in',
  'تسجيل الخروج': 'Sign out',
  'إنشاء حساب': 'Create account',
  'نسيت كلمة المرور؟': 'Forgot password?',
  'العودة لتسجيل الدخول': 'Back to sign in',
  'البريد الإلكتروني': 'Email address',
  'كلمة المرور': 'Password',
  'الاسم الكامل': 'Full name',
  'الفرقة الدراسية': 'Academic year',
  'الكلية والجامعة': 'Faculty and university',
  'رقم الهاتف': 'Phone number',
  'إرسال رابط الاستعادة': 'Send recovery link',
  'إعادة تعيين كلمة المرور': 'Reset password',
  'كلمة المرور الجديدة': 'New password',
  'حفظ كلمة المرور': 'Save password',
  'تأكيد البريد الإلكتروني مطلوب': 'Email confirmation required',
  'لوحة الإدارة': 'Admin dashboard',
  'لوحة التحكم الرئيسية': 'Administration',
  'المواعيد': 'Schedule',
  'التقييمات': 'Reviews',
  'الملف الشخصي': 'Profile',
  'دوراتي': 'My courses',
  'التقدّم': 'Progress',
  'كود الدخول': 'Access code',
  'محتوى الدرس': 'Lesson content',
  'مواعيدي القادمة': 'Upcoming schedule',
  'تقييماتي': 'My reviews',
  'تعديل الملف الشخصي': 'Edit profile',
  'حفظ التعديلات': 'Save changes',
  'إدارة المقررات': 'Manage courses',
  'إضافة أو تعديل مقرر': 'Add or edit a course',
  'طلبات التسجيل': 'Enrollment requests',
  'قائمة الطلاب': 'Student directory',
  'إدارة مواعيد الكورسات': 'Manage course schedule',
  'نشر إشعار للجميع': 'Publish an announcement',
  'إدارة المسؤولين': 'Manage administrators',
  'عنوان المقرر بالعربية': 'Course title (Arabic)',
  'عنوان المقرر بالإنجليزية': 'Course title (English)',
  'وصف المقرر بالعربية': 'Course description (Arabic)',
  'وصف المقرر بالإنجليزية': 'Course description (English)',
  'اختر الفرقة الدراسية': 'Select an academic year',
  'الفرقة الأولى': 'Year 1',
  'الفرقة الثانية': 'Year 2',
  'الفرقة الثالثة': 'Year 3',
  'الفرقة الرابعة': 'Year 4',
  'السعر': 'Price',
  'مسار الفيديو الخاص في Supabase': 'Private video path in Supabase',
  'رفع فيديو جديد (اختياري)': 'Upload a video (optional)',
  'حفظ المقرر': 'Save course',
  'موعد جديد': 'New schedule',
  'عنوان الموعد بالعربية': 'Schedule title (Arabic)',
  'عنوان الموعد بالإنجليزية': 'Schedule title (English)',
  'تاريخ ووقت البداية': 'Start date and time',
  'تاريخ ووقت النهاية': 'End date and time',
  'رابط اللقاء (اختياري)': 'Meeting link (optional)',
  'حفظ الموعد': 'Save schedule',
  'العنوان بالعربية': 'Title (Arabic)',
  'العنوان بالإنجليزية': 'Title (English)',
  'الرسالة بالعربية': 'Message (Arabic)',
  'الرسالة بالإنجليزية': 'Message (English)',
  'نشر الإشعار': 'Publish announcement',
  'ابحث عن بريد المستخدم': 'Find user by email',
  'ترقية إلى مسؤول': 'Promote to administrator',
  'إزالة صلاحية المسؤول': 'Remove administrator role',
  'حفظ الصلاحية': 'Save role',
  'معدل المقرر': 'Course rating',
  'اكتب تقييمك': 'Write your review',
  'إرسال التقييم': 'Submit review',
  'عرض التفاصيل': 'View details',
  'اطلب الالتحاق': 'Request enrollment',
  'تم استلام طلبك، بانتظار مراجعة الإدارة.': 'Your request was received and is awaiting admin approval.',
  'سجّل الدخول وتأكد من بريدك أولاً.': 'Please sign in and confirm your email first.',
  'لا توجد بيانات حتى الآن.': 'Nothing here yet.',
  'الإشعارات': 'Notifications',
  'لا توجد إشعارات جديدة.': 'No new notifications.',
  'مركز الإسراء للحقوق': 'Al-Israa Law Center',
  'مركز الإسراء': 'Al-Israa Center',
  'من نحن': 'About us',
  'تعليم قانوني متقدم للحقوق': 'Advanced legal education',
  'في جامعة الزقازيق': 'at Zagazig University',
  'استكشف المقررات': 'Explore courses',
  'انضم الآن': 'Join now',
  'مادة قانونية': 'law subjects',
  'طالب وطالبة': 'students',
  'نسبة متابعة': 'engagement rate',
  'معتمد من:': 'Trusted by:',
  'تعليم قانوني مستدام، أسلوب فخم، وتأثير فعلي': 'Sustainable legal education, premium experience, real impact',
  'إشراف أكاديمي': 'Academic supervision',
  'محاضرات قانونية متقدمة': 'Advanced legal lectures',
  'دعم تربوي مستمر': 'Continuous academic support',
  'تعلم ثلاثي الأبعاد': 'Immersive 3D learning',
  'المناهج الجامعية الأكثر طلبًا': 'Most requested university courses',
  'عرض الكل': 'View all',
  'المسار الأكاديمي': 'Academic path',
  'نظرة سريعة على مناهج كلية الحقوق – جامعة الزقازيق': 'An overview of the Zagazig Faculty of Law curriculum',
  'كلية الحقوق - جامعة الزقازيق': 'Faculty of Law - Zagazig University',
  'تعليم قانوني متميز لكل طلاب الحقوق في جامعة الزقازيق.': 'Quality legal education for every law student at Zagazig University.',
  'روابط': 'Links',
  'الدراسة': 'Study',
  'مسار الدراسة': 'Study tracks',
  'مقررات كلية الحقوق – جامعة الزقازيق': 'Faculty of Law courses - Zagazig University',
  'مبادئ القانون': 'Principles of Law',
  'النظم السياسية': 'Political Systems',
  'الاقتصاد السياسي': 'Political Economy',
  'الاقتصاد': 'Economics',
  'القانون المدني': 'Civil Law',
  'القانون الإداري': 'Administrative Law',
  'القانون الدولي': 'International Law',
  'القانون الدولي العام': 'Public International Law',
  'القانون الجنائي': 'Criminal Law',
  'القانون التجاري': 'Commercial Law',
  'القانون المالي': 'Financial Law',
  'التحكيم': 'Arbitration',
  'القانون الدولي الخاص': 'Private International Law',
  'القانون المقارن': 'Comparative Law',
  'تفاصيل المقرر': 'Course details',
  'المدة:': 'Duration:',
  'المستوى:': 'Level:',
  'التقييم:': 'Rating:',
  'ملخص المنهج': 'Course outline',
  'محتوى المقرر': 'Course content',
  'أبرز الوحدات الدراسية': 'Featured modules',
  'مواعيد المقرر': 'Course schedule',
  'المواعيد القادمة': 'Upcoming sessions',
  'آراء الطلاب': 'Student feedback',
  'تقييمات': 'Reviews',
  'الدردشة العامة والصفوف الخاصة': 'Public chat and course discussions',
  'المنتدى العام': 'Public forum',
  'الدردشة الخاصة للمقرر': 'Private course discussion',
  'أكتب سؤالك هنا...': 'Write your question here...',
  'رسالة خاصة بالمقرر...': 'Message for this course...',
  'إرسال': 'Send',
  'الإدارة': 'Administration',
  'مواعيد الكورسات': 'Course schedule',
  'مواعيد كلية الحقوق': 'Faculty of Law schedule',
  'مقررات كلية الحقوق': 'Faculty of Law courses',
  'المقرر': 'Course',
  'المجتمع': 'Community',
  'المجتمع التفاعلي': 'Student community',
  'محتوى الدرس': 'Lesson content',
  'عرض التفاصيل': 'View details',
  'تعليم قانوني متميز لكل طلاب الحقوق.': 'Quality legal education for every law student.',
  'منصة التعليم القانوني': 'Legal learning platform',
  'سجل الآن وابدأ رحلتك': 'Sign up and start learning',
  'لديك حساب بالفعل؟': 'Already have an account?',
  'ليس لديك حساب؟': 'New to the platform?',
  'تم استلام طلبك، بانتظار مراجعة الإدارة.': 'Your request was received and is awaiting admin approval.',
  'حذف': 'Delete',
  'تعديل': 'Edit',
  'اختر مقررًا': 'Select a course',
  'مقرر جديد': 'New course',
  'رابط المحاضرة': 'Join session',
  'مشاهدة المحاضرة': 'Watch lesson',
  'طلب التحاق جديد': 'New enrollment request',
  'مستخدمون': 'Users',
  'مراجعة التقييمات': 'Review ratings',
  'تقييم المقرر': 'Rate this course',
  'الموقع التعليمي لمركز الإسراء': 'Al-Israa Law Center learning platform',
  'تسجيل دخول آمن عبر البريد الإلكتروني': 'Secure email sign-in',
  'تأكيد البريد الإلكتروني مطلوب': 'Email confirmation required',
  'سجّل الدخول لعرض المحادثات وإرسال الرسائل.': 'Sign in to view conversations and send messages.',
  'المحادثة الخاصة متاحة فقط للطلاب المسجلين والمعتمدين في المقرر.': 'Private discussions are available only to students with approved course enrollment.',
  'الحد الأقصى لحجم الفيديو 50 ميغابايت.': 'The maximum video upload size is 50 MB.',
  'تاريخ ووقت البداية': 'Start date and time',
  'تاريخ ووقت النهاية': 'End date and time',
  'رفع فيديو جديد (اختياري)': 'Upload a video (optional)',
  'نشر المقرر': 'Publish course',
  'طلب التحاق جديد': 'New enrollment request',
  'طلب اشتراك وموافقة الإدارة': 'Enrollment request and admin approval',
  'إنشاء حساب طالب جديد في منصة مركز الإسراء.': 'Create a student account at Al-Israa.',
  'استعادة كلمة المرور | Al-Israa Law Center': 'Reset password | Al-Israa Law Center',
  'تسجيل الدخول | Al-Israa Law Center': 'Sign in | Al-Israa Law Center',
  'إنشاء حساب | Al-Israa Law Center': 'Create account | Al-Israa Law Center',
  'لوحة الطالب | Al-Israa Law Center': 'Student dashboard | Al-Israa Law Center',
  'لوحة الإدارة | Al-Israa Law Center': 'Admin dashboard | Al-Israa Law Center',
  'المقررات | Al-Israa Law Center': 'Courses | Al-Israa Law Center',
  'المجتمع | Al-Israa Law Center': 'Community | Al-Israa Law Center',
  'تفاصيل المقرر | Al-Israa Law Center': 'Course details | Al-Israa Law Center',
  'الدashboard': 'Dashboard',
  'قيد المراجعة': 'Pending review',
  'مقبول': 'Approved',
  'مرفوض': 'Rejected',
  'الاسم': 'Name',
  'الفرقة': 'Year',
  'الكلية': 'Faculty',
  'الهاتف': 'Phone',
  'البريد': 'Email',
  'تم تحديث البيانات بنجاح.': 'Your changes were saved.',
  'تم إرسال رابط إعادة التعيين إلى بريدك.': 'A password reset link has been sent to your email.',
  'تحقق من بريدك لإكمال التسجيل.': 'Check your email to complete registration.',
  'تم تحديث كلمة المرور.': 'Your password has been updated.',
  'يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول.': 'Confirm your email before signing in.',
  'تم نشر الإشعار.': 'Announcement published.',
  'تم حفظ المقرر.': 'Course saved.',
  'تم حفظ الموعد.': 'Schedule saved.',
  'تم تحديث حالة الطلب.': 'Enrollment status updated.',
  'تم حفظ التقييم.': 'Your review was saved.',
  'لم يتم العثور على حساب بهذا البريد.': 'No account was found for this email.',
  'حدث خطأ. حاول مرة أخرى.': 'Something went wrong. Please try again.',
  'حدث خطأ في إعداد Supabase.': 'Supabase is not configured yet.',
  'لا تملك صلاحية لهذه الصفحة.': 'You do not have permission to view this page.',
  'الصلاحية': 'Role',
  'مسؤول': 'Administrator',
  'طالب': 'Student',
  'مراجعة التقييمات': 'Review ratings',
  'قائمة الطلاب والمسؤولين': 'Students and administrators',
  'مواعيد الكورسات': 'Course schedule',
  'الدردشة العامة والصفوف الخاصة': 'Public chat and course discussions',
  'المحادثة الخاصة متاحة فقط للطلاب المسجلين والمعتمدين في المقرر.': 'Private discussions are available only to students with approved course enrollment.',
  'سجّل الدخول لعرض المحادثات وإرسال الرسائل.': 'Sign in to view conversations and send messages.',
  'الحد الأقصى لحجم الفيديو 50 ميغابايت.': 'The maximum video upload size is 50 MB.',
  'لا يمكنك إزالة صلاحية المسؤول من حسابك الحالي.': 'You cannot remove your own administrator role.',
  'يجب أن يبدأ رابط اللقاء بـ https://.': 'Meeting links must use https://.',
  'شعار مركز الإسراء للحقوق': 'Al-Israa Law Center logo',
  'Toggle language': 'تغيير اللغة',
  'Toggle theme': 'تغيير المظهر',
  'الاستحقاق وقواعد التقاضي': 'Remedies and litigation procedures',
  'القانون المدني – الفرقة الثانية': 'Civil Law - Year 2',
  'Preview Lecture': 'Preview lecture',
  '5 تقييمات': '5 reviews',
  '6 تقييمات': '6 reviews',
  '8 تقييمات': '8 reviews',
  '12 درس': '12 lessons',
  '10 درس': '10 lessons',
  '11 درس': '11 lessons',
  '13 درس': '13 lessons',
  '14 درس': '14 lessons',
  '15 درس': '15 lessons',
  '16 درس': '16 lessons',
  '18 درس': '18 lessons',
  '12 أسبوع': '12 weeks',
  '13 أسبوع': '13 weeks',
  '14 أسبوع': '14 weeks',
  '15 أسبوع': '15 weeks',
  '16 أسبوع': '16 weeks',
  '17 أسبوع': '17 weeks',
  '18 أسبوع': '18 weeks',
  '350 ج.م': '350 EGP',
  '320 ج.م': '320 EGP',
  '290 ج.م': '290 EGP',
  '420 ج.م': '420 EGP',
  '390 ج.م': '390 EGP',
  '410 ج.م': '410 EGP',
  '500 ج.م': '500 EGP',
  '470 ج.م': '470 EGP',
  '450 ج.م': '450 EGP',
  '560 ج.م': '560 EGP',
  '530 ج.م': '530 EGP',
  '520 ج.م': '520 EGP',
  'الدكتورة إسراء الدسوقي': 'Dr. Israa El-Desouky',
  'تعذر تحميل التحقق الأمني.': 'Could not load the security check.',
  'جاري تسجيل الدخول...': 'Signing in...',
  'تعذر حفظ جلسة تسجيل الدخول. حاول مرة أخرى.': 'Could not establish the sign-in session. Please try again.',
  'روابط التواصل الاجتماعي': 'Social media links',
  'أدخل روابط تبدأ بـ https://، ورقم واتساب مع مفتاح الدولة، مثل +20.': 'Enter links beginning with https:// and a WhatsApp number with its country code, such as +20.',
  'رقم واتساب': 'WhatsApp number',
  'حفظ روابط التواصل': 'Save contact links',
  'تابعنا وتواصل معنا': 'Follow and contact us',
  'حقوق الموقع والمطور': 'Website and developer credits',
  'جميع الحقوق محفوظة لدى R2J WEB DEV': 'All rights reserved by R2J WEB DEV',
  'حفظ حقوق الموقع': 'Save website credits',
  'فيسبوك': 'Facebook',
  'إنستغرام': 'Instagram',
  'تيك توك': 'TikTok',
  'واتساب': 'WhatsApp',
  'منصة تعليمية متكاملة تحت إشراف الدكتورة إسراء الدسوقي، تقدم شرحًا متقدمًا لجميع المواد الدراسية بكلية الحقوق، مع محتوى تفاعلي، محاضرات متقدمة، وتجربة تعليمية حديثة ثلاثية الأبعاد.': 'An integrated learning platform supervised by Dr. Israa El-Desouky, with advanced law lectures, interactive resources, and a modern 3D learning experience.',
  'مخرجات تعليمية منظمة ومبسطة للمقررات الأساسية والحالات العملية.': 'Clear, structured resources for core courses and practical case studies.',
  'مراجعات، أسئلة التطبيق، ومتابعة مباشرة عبر المجتمع التفاعلي.': 'Reviews, practice questions, and direct support through the student community.',
  'تجربة بصرية عالية الجودة تجمع بين التفاعل، التصميم، ومحتوى أكاديمي متقدم.': 'A polished learning experience combining interaction, design, and advanced academic content.',
  'مدرّسة ومحاضرة متخصصة في الفقه والقانون، تعمل على توظيف أحدث أساليب التعليم التفاعلي، مع دعم الطلاب في الفهم العميق للمواد القانونية وتحويلهم إلى باحثين وممارسين فعليين.': 'A law lecturer who uses modern teaching methods to help students build a deep understanding of legal principles and practical application.',
  'مقدمة في مصادر القانون، تنظيم الدولة، والفروع الأساسية في علم القانون.': 'An introduction to legal sources, the state, and the main branches of law.',
  'الموجز الكامل للعقود، الالتزام، الملكية، والحقوق العينية الأساسية.': 'A complete overview of contracts, obligations, ownership, and real rights.',
  'الجرائم، العقوبات، المسؤولية الجنائية، والشرح العملي للتطبيقات القضائية.': 'Crimes, penalties, criminal liability, and practical case law.',
  'نظرة سريعة على مناهج كلية الحقوق – جامعة الزقازيق': 'A quick overview of the Zagazig Faculty of Law curriculum',
  'مبادئ القانون': 'Principles of Law',
  'المدخل إلى القانون': 'Introduction to Law',
  'المدخل إلى الفلسفة': 'Introduction to Philosophy',
  'الاقتصاد السياسي': 'Political Economy',
  'النظم السياسية': 'Political Systems',
  'المبادئ الدستورية': 'Constitutional Principles',
  'القانون الإداري': 'Administrative Law',
  'القانون الدولي العام': 'Public International Law',
  'مبادئ القانون الإداري': 'Principles of Administrative Law',
  'القانون البحري': 'Maritime Law',
  'دراسات تطبيقية': 'Applied Studies',
  'مقدمة شاملة في مصادر القانون، الأسس النظرية، والأنظمة القانونية الأساسية.': 'An introduction to legal sources, legal theory, and core legal systems.',
  'دراسة السلطة، الدولة، المؤسسات، ومقارنة النظم السياسية.': 'A study of political power, the state, institutions, and political systems.',
  'أساسيات الأسواق، الطلب والعرض، والمبادئ الاقتصادية المؤثرة في القانون.': 'Markets, supply and demand, and the economic principles that shape law.',
  'عقد البيع، الالتزام، الحقوق العينية، والملكية في التطبيق العملي.': 'Sale contracts, obligations, real rights, and ownership in practice.',
  'إجراءات الإدارة، المشروعية، والرقابة الإدارية على أعمال السلطات.': 'Administrative procedures, legality, and oversight of government action.',
  'الكيان الدولي، السيادة، المعاهدات، والالتزامات الدولية.': 'International entities, sovereignty, treaties, and international obligations.',
  'الجرائم، العقوبة، المسئولية الجنائية، والنظرية التطبيقية.': 'Crimes, penalties, criminal responsibility, and applied theory.',
  'التجارة الإلكترونية، الشركات، الأوراق التجارية، والملكية الصناعية.': 'E-commerce, companies, negotiable instruments, and industrial property.',
  'الموازنة، الضرائب، الجمارك، والضوابط المالية العامة.': 'Budgets, taxation, customs, and public finance.',
  'الطريق البديل لحل المنازعات، الإجراءات، والفقه المقارن.': 'Alternative dispute resolution, procedures, and comparative jurisprudence.',
  'القانون الواجب التطبيق، تنازع القوانين، والقضايا الدولية المعاصرة.': 'Applicable law, conflicts of laws, and current international issues.',
  'مقارنة النظم القانونية العالمية، المنهجية والمقاربات التطبيقية.': 'Comparative legal systems, methods, and practical approaches.',
  'يتناول هذا المقرر الأسس القانونية للعقود، الالتزامات، الحقوق العينية، والمراحل العملية في فهم القواعد المدنية في التطبيق والأحكام.': 'This course covers contract law, obligations, real rights, and practical application of civil law.',
  'مفهوم الالتزام وسببه': 'Obligations and their legal basis',
  'العقد الصحيح والمخلّ': 'Valid and defective contracts',
  'الملكية وحقوق عينية أخرى': 'Ownership and other real rights',
  'التزامات البائع والمشتري': 'Obligations of buyers and sellers',
  'تطبيقات قضائية وحالات عملية': 'Case law and practical exercises',
  'الوحدة 1': 'Module 1',
  'الوحدة 2': 'Module 2',
  'الوحدة 3': 'Module 3',
  'مبادئ الالتزام وأركانه، مصادره، وإثباته في القانون المدني.': 'Obligations: principles, elements, sources, and proof in civil law.',
  'العقد، شروطه، الأثر القانوني، وحالات إبطال التعاقدات.': 'Contracts, their requirements, legal effect, and grounds for invalidity.',
  'الملكية، الحقوق العينية، وشرح التطبيق القضائي للحالات القضائية.': 'Ownership, real rights, and the judicial application of legal cases.',
  'تأكد من بريدك لإكمال التسجيل.': 'Check your email to complete registration.',
  'سنرسل رابط تأكيد إلى بريدك الإلكتروني قبل تفعيل الحساب.': 'We will send an email confirmation link before activating your account.',
  'استعادة الوصول': 'Account recovery',
  'إدارة المقررات': 'Manage courses',
  'قائمة الطلاب': 'Student directory',
  'تعليم قانوني متميز لكل طلاب الحقوق.': 'Quality legal education for every law student.',
};

const englishToArabic = Object.fromEntries(
  Object.entries(textMap).map(([arabic, english]) => [english, arabic])
);

function t(arabic, english) {
  return appState.language === 'ar' ? arabic : english;
}

function addCaptchaWidget() {
  const siteKey = window.ALISRAA_TURNSTILE_SITE_KEY;
  if (!siteKey || siteKey.includes('YOUR_') || !document.querySelector('.captcha-widget')) return;
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    document.querySelectorAll('.captcha-widget').forEach((widget) => {
      window.turnstile.render(widget, {
        sitekey: siteKey,
        callback: (token) => { widget.dataset.token = token; },
        'expired-callback': () => { delete widget.dataset.token; },
      });
    });
  };
  script.onerror = () => showToast(t('تعذر تحميل التحقق الأمني.', 'Could not load the security check.'), true);
  document.head.appendChild(script);
}

function getCaptchaToken(form) {
  return form.querySelector('.captcha-widget')?.dataset.token;
}

function translateStaticText() {
  const map = appState.language === 'ar' ? englishToArabic : textMap;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const trimmed = node.nodeValue.trim();
    if (map[trimmed]) {
      node.nodeValue = node.nodeValue.replace(trimmed, map[trimmed]);
    }
  }

  document.querySelectorAll('[placeholder], [aria-label], [title]').forEach((element) => {
    ['placeholder', 'aria-label', 'title'].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value && map[value.trim()]) {
        element.setAttribute(attribute, map[value.trim()]);
      }
    });
  });
}

function applyLanguage() {
  document.documentElement.lang = appState.language;
  document.documentElement.dir = appState.language === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang-toggle span').forEach((label) => {
    label.textContent = appState.language === 'ar' ? 'EN' : 'عربي';
  });
  const map = appState.language === 'ar' ? englishToArabic : textMap;
  if (map[document.title]) document.title = map[document.title];
  const description = document.querySelector('meta[name="description"]');
  if (description && map[description.content]) description.content = map[description.content];
  translateStaticText();
  localStorage.setItem('al_israa_lang', appState.language);
}

function applyTheme() {
  document.body.classList.toggle('theme-dark', appState.theme === 'dark');
  document.body.classList.toggle('theme-light', appState.theme === 'light');
  const icon = document.querySelector('.theme-toggle i');
  if (icon) icon.textContent = appState.theme === 'dark' ? '☀' : '☾';
  localStorage.setItem('al_israa_theme', appState.theme);
}

function showToast(message, isError) {
  let toast = document.querySelector('.site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.toggle('is-error', Boolean(isError));
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
}

function reportError(error) {
  console.error(error);
  showToast(error.message || t('حدث خطأ. حاول مرة أخرى.', 'Something went wrong. Please try again.'), true);
}

function getClient() {
  const url = window.ALISRAA_SUPABASE_URL;
  const key = window.ALISRAA_SUPABASE_ANON_KEY;
  if (!window.supabase || !url || !key || url.includes('YOUR-PROJECT') || key.includes('YOUR_')) {
    return null;
  }
  return window.supabase.createClient(url, key);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[character]));
}

function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

async function resolveCourseVideoUrl(videoPath) {
  const path = String(videoPath || '').trim();
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (!appState.client) return null;

  const { data } = appState.client.storage
    .from('course-videos')
    .getPublicUrl(path);
  return data?.publicUrl || null;
}

function bindCourseVideo(video, initialUrl, storagePath) {
  if (!initialUrl) return;
  let signedFallbackAttempted = false;
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.src = initialUrl;

  video.addEventListener('error', async () => {
    console.error('Course video failed to load.', {
      storagePath,
      initialUrl,
      mediaError: video.error,
    });
    if (signedFallbackAttempted || !storagePath || /^https?:\/\//i.test(storagePath)) return;
    signedFallbackAttempted = true;
    try {
      const { data, error } = await appState.client.storage
        .from('course-videos')
        .createSignedUrl(storagePath, 3600);
      if (error) throw error;
      if (data?.signedUrl) {
        video.src = data.signedUrl;
        video.load();
      }
    } catch (error) {
      console.error('Could not create a signed course video URL.', error);
    }
  });
}

function renderSiteSocialLinks() {
  const settings = appState.siteSettings;
  const icons = {
    facebook: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 8.3V6.2c0-1 .7-1.2 1.2-1.2H18V1.1L14.5 1C10.9 1 10 3.6 10 5.8v2.5H7v4h3V23h4.5V12.3H18l.5-4H14Z"></path></svg>',
    instagram: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"></rect><circle cx="12" cy="12" r="4.2"></circle><circle cx="17.7" cy="6.4" r="1.1" class="social-fill-dot"></circle></svg>',
    tiktok: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.8 2v12.2a4.8 4.8 0 1 1-4.8-4.8v3.2a1.7 1.7 0 1 0 1.7 1.7V2h3.1c.3 2.4 1.9 4.2 4.2 4.8V10c-1.6-.1-3-.7-4.2-1.6V2h0Z"></path></svg>',
    whatsapp: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.5 11.7A8.5 8.5 0 0 1 7.7 19L3 20l1.1-4.5A8.5 8.5 0 1 1 20.5 11.7Z"></path><path d="M8.2 7.8c.3-.5.7-.5 1-.5h.4c.2 0 .4 0 .5.4l.8 1.9c.1.3 0 .5-.1.7l-.6.7c-.2.2-.2.4-.1.6.5.9 1.3 1.7 2.2 2.2.2.1.4.1.6-.1l.8-1c.2-.2.4-.3.7-.1l1.7.8c.3.1.5.3.5.5 0 .5-.2 1.3-.8 1.8-.5.5-1.2.7-1.9.6-1.1-.2-2.6-.8-4-2.1-1.2-1.1-2-2.4-2.2-3.4-.2-.9 0-1.6.5-2Z"></path></svg>',
  };
  const entries = [
    { key: 'facebook_url', name: 'facebook', label: t('فيسبوك', 'Facebook') },
    { key: 'instagram_url', name: 'instagram', label: t('إنستغرام', 'Instagram') },
    { key: 'tiktok_url', name: 'tiktok', label: t('تيك توك', 'TikTok') },
  ];

  document.querySelectorAll('.footer-grid').forEach((footer) => {
    footer.querySelector('.site-social-links')?.remove();
    const links = entries
      .map((entry) => ({ ...entry, href: safeHttpsUrl(settings[entry.key]) }))
      .filter((entry) => entry.href);
    const phone = String(settings.whatsapp_number || '').trim();
    const digits = phone.replace(/\D/g, '');
    if (digits.length >= 8 && digits.length <= 15) {
      links.push({
        name: 'whatsapp',
        label: t('واتساب', 'WhatsApp'),
        href: `https://wa.me/${digits}`,
        phone,
      });
    }
    if (!links.length) return;

    const section = document.createElement('div');
    section.className = 'site-social-links';
    const heading = document.createElement('h4');
    heading.textContent = t('تابعنا وتواصل معنا', 'Follow and contact us');
    const linkList = document.createElement('div');
    linkList.className = 'social-link-list';
    links.forEach((entry) => {
      const link = document.createElement('a');
      link.className = `social-link social-link-${entry.name}`;
      link.href = entry.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', entry.phone ? `${entry.label}: ${entry.phone}` : entry.label);
      link.title = entry.label;
      link.innerHTML = icons[entry.name];
      if (entry.phone) {
        const number = document.createElement('span');
        number.className = 'social-phone-number';
        number.textContent = entry.phone;
        link.appendChild(number);
      }
      linkList.appendChild(link);
    });
    section.append(heading, linkList);
    const footerColumn = footer.lastElementChild;
    if (footerColumn) footerColumn.appendChild(section);
    else footer.appendChild(section);
  });
}

function renderCopyright() {
  const settings = appState.siteSettings;
  const year = new Date().getFullYear();
  const copyrightText = appState.language === 'ar'
    ? (settings.copyright_text_ar || 'جميع الحقوق محفوظة لدى R2J WEB DEV')
    : (settings.copyright_text_en || 'All rights reserved by R2J WEB DEV');
  const developerName = String(settings.developer_name || 'R2J WEB DEV').trim();
  const iconUrl = String(settings.developer_icon_url || 'assets/r2j-web-dev.png').trim();

  document.querySelectorAll('.footer-grid').forEach((footer) => {
    const footerHost = footer.closest('.site-footer') || footer.parentElement;
    if (!footerHost) return;
    footerHost.querySelector('.copyright-bar')?.remove();
    const bar = document.createElement('div');
    bar.className = 'copyright-bar';
    const copyright = document.createElement('span');
    copyright.className = 'copyright-text';
    copyright.textContent = `© ${year} ${copyrightText}`;

    const developer = document.createElement('span');
    developer.className = 'developer-credit';
    if (iconUrl) {
      const icon = document.createElement('img');
      icon.className = 'developer-icon';
      icon.alt = developerName;
      icon.src = iconUrl;
      developer.appendChild(icon);
    }
    if (settings.developer_url) {
      const developerLink = document.createElement('a');
      const url = safeHttpsUrl(settings.developer_url);
      if (url) {
        developerLink.href = url;
        developerLink.target = '_blank';
        developerLink.rel = 'noopener noreferrer';
      }
      developerLink.textContent = developerName;
      developer.appendChild(developerLink);
    } else {
      developer.append(document.createTextNode(developerName));
    }
    bar.append(copyright, developer);
    footerHost.appendChild(bar);
  });
}

async function loadSiteSettings() {
  const { data, error } = await appState.client.from('site_settings')
    .select('facebook_url,instagram_url,tiktok_url,whatsapp_number,copyright_text_ar,copyright_text_en,developer_name,developer_url,developer_icon_url,hero_title_ar,hero_title_en,hero_subtitle_ar,hero_subtitle_en,courses_title_ar,courses_title_en,community_title_ar,community_title_en')
    .eq('id', 1).maybeSingle();
  if (error) throw error;
  appState.siteSettings = data || {};
  if (data) {
    document.querySelectorAll('#siteSettingsForm, #copyrightSettingsForm, #siteContentForm').forEach((form) => {
      Object.keys(data).forEach((key) => {
        const input = form.elements.namedItem(key);
        if (input) input.value = data[key] || '';
      });
    });
  }
  renderEditableSiteContent();
  renderSiteSocialLinks();
  renderCopyright();
}

function renderEditableSiteContent() {
  const settings = appState.siteSettings;
  const mappings = {
    hero_title: appState.language === 'ar' ? settings.hero_title_ar : settings.hero_title_en,
    hero_subtitle: appState.language === 'ar' ? settings.hero_subtitle_ar : settings.hero_subtitle_en,
    courses_title: appState.language === 'ar' ? settings.courses_title_ar : settings.courses_title_en,
    community_title: appState.language === 'ar' ? settings.community_title_ar : settings.community_title_en,
  };
  document.querySelectorAll('[data-cms]').forEach((element) => {
    const value = mappings[element.dataset.cms];
    if (value) element.textContent = String(value);
  });
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat(appState.language === 'ar' ? 'ar-EG' : 'en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getLocalized(row, field) {
  if (!row) return '';
  const suffix = appState.language === 'ar' ? '_ar' : '_en';
  return row[`${field}${suffix}`] || row[`${field}_en`] || row[field] || '';
}

async function loadProfile() {
  if (!appState.client || !appState.user) return null;
  const { data, error } = await appState.client
    .from('profiles')
    .select('id,email,full_name,faculty,academic_year,phone,role,account_status,muted_until,kicked_until')
    .eq('id', appState.user.id)
    .single();
  if (error) throw error;
  appState.profile = data;
  return data;
}

function isAdmin() {
  return appState.profile?.role === 'admin';
}

function ensureConfigured() {
  if (appState.client) return true;
  showToast(t(
    'أكمل إعداد Supabase في js/config.js أولاً.',
    'Configure Supabase in js/config.js first.'
  ), true);
  return false;
}

async function guardPage() {
  const path = location.pathname.toLowerCase();
  const isAdminPage = path.endsWith('/admin.html') || path.endsWith('admin.html');
  const isProtectedPage = isAdminPage || path.endsWith('dashboard.html');
  if (!isProtectedPage) return;

  if (!appState.user) {
    location.replace(`login.html?next=${encodeURIComponent(location.pathname.split('/').pop())}`);
    return;
  }
  if (isAdminPage && !isAdmin()) {
    showToast(t('لا تملك صلاحية لهذه الصفحة.', 'You do not have permission to view this page.'), true);
    location.replace('dashboard.html');
  }
}

function updateNavigation() {
  document.querySelectorAll('.lang-toggle').forEach((toggle) => {
    if (toggle.dataset.bound) return;
    toggle.dataset.bound = 'true';
    toggle.addEventListener('click', toggleLanguage);
  });

  const loginLink = document.querySelector('.nav-actions a[href="login.html"]');
  if (loginLink && appState.user) {
    loginLink.classList.add('is-sign-out');
    loginLink.textContent = t('تسجيل الخروج', 'Sign out');
    loginLink.href = '#sign-out';
    loginLink.addEventListener('click', async (event) => {
      event.preventDefault();
      const { error } = await appState.client.auth.signOut();
      if (error) return reportError(error);
      location.href = 'index.html';
    }, { once: true });
  }

  const nav = document.querySelector('.nav-actions');
  if (nav && isAdmin() && !document.querySelector('.admin-dashboard-link')) {
    const adminLink = document.createElement('a');
    adminLink.className = 'admin-dashboard-link';
    adminLink.href = 'admin.html';
    adminLink.textContent = t('لوحة الإدارة', 'Admin dashboard');
    adminLink.setAttribute('aria-label', t('لوحة الإدارة', 'Admin dashboard'));
    adminLink.title = t('لوحة الإدارة', 'Admin dashboard');
    nav.prepend(adminLink);
  } else if (nav && !isAdmin()) {
    nav.querySelector('.admin-dashboard-link')?.remove();
  }
  if (nav && !nav.querySelector('.notification-trigger')) {
    const wrapper = document.createElement('div');
    wrapper.className = 'notification-wrap';
    wrapper.innerHTML = `
      <button class="notification-trigger" type="button" aria-label="${t('الإشعارات', 'Notifications')}" aria-expanded="false">
        <span aria-hidden="true">🔔</span><span class="notification-count" hidden>0</span>
      </button>
      <div class="notification-panel" hidden>
        <h3>${t('الإشعارات', 'Notifications')}</h3>
        <div class="notification-list"></div>
      </div>
    `;
    nav.prepend(wrapper);
    wrapper.querySelector('.notification-trigger').addEventListener('click', (event) => {
      event.stopPropagation();
      const panel = wrapper.querySelector('.notification-panel');
      panel.hidden = !panel.hidden;
      wrapper.querySelector('.notification-trigger').setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) renderNotifications();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!wrapper.contains(event.target)) {
        wrapper.querySelector('.notification-panel').hidden = true;
        wrapper.querySelector('.notification-trigger').setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (!document.querySelector('.lang-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'lang-toggle language-floating-toggle';
    toggle.type = 'button';
    toggle.innerHTML = `<span>${appState.language === 'ar' ? 'EN' : 'عربي'}</span>`;
    toggle.addEventListener('click', toggleLanguage);
    document.body.appendChild(toggle);
  }
}

function toggleLanguage() {
  appState.language = appState.language === 'ar' ? 'en' : 'ar';
  applyLanguage();
  updateNavigation();
  renderSiteSocialLinks();
  renderCopyright();
  renderEditableSiteContent();
  renderNotifications();
  renderCourseCatalog().catch(reportError);
  loadCourseDetails().catch(reportError);
  loadDashboard().catch(reportError);
}

async function loadAnnouncements() {
  if (!appState.client || !appState.user) return;
  const requests = [
    appState.client.from('announcements').select('*').order('created_at', { ascending: false }).limit(30),
    appState.client.from('announcement_reads').select('announcement_id').eq('profile_id', appState.user.id),
  ];
  if (isAdmin()) {
    requests.push(appState.client.from('admin_notifications').select('*').order('created_at', { ascending: false }).limit(30));
  }
  const [announcements, reads, adminNotifications] = await Promise.all(requests);
  if (announcements.error) throw announcements.error;
  if (reads.error) throw reads.error;
  appState.announcements = announcements.data;
  appState.announcementReads = new Set(reads.data.map((item) => item.announcement_id));
  appState.adminNotifications = adminNotifications?.data || [];
  renderNotifications();
}

function renderNotifications() {
  const list = document.querySelector('.notification-list');
  const count = document.querySelector('.notification-count');
  if (!list || !count) return;
  const publicItems = appState.announcements.map((item) => ({
    ...item, isRead: appState.announcementReads.has(item.id), isAdmin: false,
  }));
  const adminItems = appState.adminNotifications.map((item) => ({
    ...item, isRead: Boolean(item.read_at), isAdmin: true,
  }));
  const items = [...publicItems, ...adminItems].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const unreadCount = items.filter((item) => !item.isRead).length;
  count.textContent = String(unreadCount);
  count.hidden = unreadCount === 0;
  list.replaceChildren();

  if (!items.length) {
    const empty = document.createElement('p');
    empty.textContent = t('لا توجد إشعارات جديدة.', 'No new notifications.');
    list.appendChild(empty);
    return;
  }

  items.forEach((announcement) => {
    const item = document.createElement('article');
    item.className = `notification-item${announcement.isRead ? '' : ' is-unread'}`;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', getLocalized(announcement, 'title'));
    const title = document.createElement('strong');
    title.textContent = getLocalized(announcement, 'title');
    const body = document.createElement('p');
    body.textContent = getLocalized(announcement, 'body');
    const date = document.createElement('small');
    date.textContent = formatDate(announcement.created_at);
    item.append(title, body, date);
    const openDetails = () => openNotificationDetails(announcement);
    item.addEventListener('click', openDetails);
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
        openDetails();
      }
    });
    list.appendChild(item);
  });
}

async function openNotificationDetails(announcement) {
  if (!announcement.isRead) {
    const { error } = announcement.isAdmin
      ? await appState.client.from('admin_notifications').update({ read_at: new Date().toISOString() }).eq('id', announcement.id)
      : await appState.client.from('announcement_reads').upsert({
        announcement_id: announcement.id,
        profile_id: appState.user.id,
      });
    if (error) return reportError(error);
    if (announcement.isAdmin) announcement.read_at = new Date().toISOString();
    else appState.announcementReads.add(announcement.id);
  }

  document.querySelector('.notification-details')?.remove();
  const dialog = document.createElement('section');
  dialog.className = 'notification-details';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.innerHTML = `
    <div class="notification-details-card">
      <button class="notification-details-close" type="button" aria-label="${t('إغلاق', 'Close')}">×</button>
      <span class="eyebrow">${t('تفاصيل الإشعار', 'Notification details')}</span>
      <h2></h2>
      <p class="notification-details-body"></p>
      <small></small>
    </div>
  `;
  dialog.querySelector('h2').textContent = getLocalized(announcement, 'title');
  dialog.querySelector('.notification-details-body').textContent = getLocalized(announcement, 'body');
  dialog.querySelector('small').textContent = formatDate(announcement.created_at);
  const close = () => dialog.remove();
  dialog.querySelector('.notification-details-close').addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  document.body.appendChild(dialog);
  dialog.querySelector('.notification-details-close').focus();
  renderNotifications();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.querySelector('.notification-details')?.remove();
    document.querySelectorAll('.notification-panel').forEach((panel) => { panel.hidden = true; });
    document.querySelectorAll('.notification-trigger').forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }
});

function subscribeToAnnouncements() {
  if (!appState.client || !appState.user) return;
  appState.client.channel('site-announcements')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'announcements',
    }, (payload) => {
      appState.announcements.unshift(payload.new);
      renderNotifications();
      showToast(getLocalized(payload.new, 'title'));
    })
    .subscribe();
  if (isAdmin()) {
    appState.client.channel('admin-notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_notifications',
      }, (payload) => {
        appState.adminNotifications.unshift(payload.new);
        renderNotifications();
        showToast(getLocalized(payload.new, 'title'));
        renderAdminRequests().catch(reportError);
      })
      .subscribe();
  }
  appState.client.channel('course-schedule-updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'course_schedules' }, () => {
      loadDashboard().catch(reportError);
      if (isAdmin()) renderAdminSchedules().catch(reportError);
    })
    .subscribe();
  appState.client.channel('my-enrollment-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'enrollments',
      filter: `profile_id=eq.${appState.user.id}`,
    }, () => {
      loadDashboard().catch(reportError);
    })
    .subscribe();
  appState.client.channel('community-chat')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'community_messages' }, () => {
      loadCommunityMessages().catch(reportError);
    })
    .subscribe();
}

async function signUp(event) {
  event.preventDefault();
  if (!ensureConfigured()) return;
  const form = event.currentTarget;
  const values = new FormData(form);
  const captchaToken = getCaptchaToken(form);
  const { error } = await appState.client.auth.signUp({
    email: String(values.get('email')).trim().toLowerCase(),
    password: String(values.get('password')),
    options: {
      data: {
        full_name: String(values.get('full_name')).trim(),
        faculty: String(values.get('faculty')).trim(),
        academic_year: String(values.get('academic_year')),
        phone: String(values.get('phone')).trim(),
      },
      emailRedirectTo: new URL('dashboard.html', location.href).href,
      captchaToken,
    },
  });
  if (error) return reportError(error);
  showToast(t('تحقق من بريدك لإكمال التسجيل.', 'Check your email to complete registration.'));
  form.reset();
}

async function signIn(event) {
  event.preventDefault();
  if (!ensureConfigured()) return;
  const form = event.currentTarget;
  const button = form.querySelector('[type="submit"]');
  const values = new FormData(form);
  const captchaToken = getCaptchaToken(form);
  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = t('جاري تسجيل الدخول...', 'Signing in...');
  }
  const { data, error } = await appState.client.auth.signInWithPassword({
    email: String(values.get('email')).trim().toLowerCase(),
    password: String(values.get('password')),
    options: captchaToken ? { captchaToken } : undefined,
  });
  if (button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || t('تسجيل الدخول', 'Sign in');
  }
  if (error) return reportError(error);
  if (!data.user?.email_confirmed_at) {
    await appState.client.auth.signOut();
    showToast(t('يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول.', 'Confirm your email before signing in.'), true);
    return;
  }
  const { data: sessionData, error: sessionError } = await appState.client.auth.getSession();
  if (sessionError) return reportError(sessionError);
  if (!sessionData.session) {
    showToast(t('تعذر حفظ جلسة تسجيل الدخول. حاول مرة أخرى.', 'Could not establish the sign-in session. Please try again.'), true);
    return;
  }
  const { data: profile } = await appState.client
    .from('profiles')
    .select('full_name')
    .eq('id', data.user.id)
    .maybeSingle();
  const next = new URLSearchParams(location.search).get('next');
  const welcomeName = String(profile?.full_name || data.user?.user_metadata?.full_name || values.get('email') || '').trim();
  sessionStorage.setItem('al_israa_welcome_name', welcomeName);
  sessionStorage.setItem('al_israa_welcome_language', appState.language);
  location.replace(next === 'admin.html' ? 'admin.html' : 'dashboard.html');
}

async function sendPasswordReset(event) {
  event.preventDefault();
  if (!ensureConfigured()) return;
  const email = String(new FormData(event.currentTarget).get('email')).trim().toLowerCase();
  const { error } = await appState.client.auth.resetPasswordForEmail(email, {
    redirectTo: new URL('update-password.html', location.href).href,
    ...(getCaptchaToken(event.currentTarget)
      ? { captchaToken: getCaptchaToken(event.currentTarget) }
      : {}),
  });
  if (error) return reportError(error);
  showToast(t('تم إرسال رابط إعادة التعيين إلى بريدك.', 'A password reset link has been sent to your email.'));
}

async function updatePassword(event) {
  event.preventDefault();
  if (!ensureConfigured()) return;
  const password = String(new FormData(event.currentTarget).get('password'));
  const { error } = await appState.client.auth.updateUser({ password });
  if (error) return reportError(error);
  showToast(t('تم تحديث كلمة المرور.', 'Your password has been updated.'));
  setTimeout(() => location.replace('dashboard.html'), 1000);
}

function bindAuthForms() {
  document.getElementById('registerForm')?.addEventListener('submit', signUp);
  document.getElementById('loginForm')?.addEventListener('submit', signIn);
  document.getElementById('forgotForm')?.addEventListener('submit', sendPasswordReset);
  document.getElementById('updatePasswordForm')?.addEventListener('submit', updatePassword);
}

async function loadCourses() {
  if (!appState.client) return [];
  const { data, error } = await appState.client
    .from('courses')
    .select('*')
    .order('academic_year')
    .order('title_en');
  if (error) throw error;
  const { data: reviews, error: reviewError } = await appState.client
    .from('course_reviews').select('course_id,rating');
  if (reviewError) throw reviewError;
  const ratings = new Map();
  reviews.forEach(({ course_id, rating }) => {
    const current = ratings.get(course_id) || { total: 0, count: 0 };
    current.total += rating;
    current.count += 1;
    ratings.set(course_id, current);
  });
  appState.courses = data.map((course) => {
    const average = ratings.get(course.id);
    return { ...course, average_rating: average ? average.total / average.count : 0 };
  });
  return appState.courses;
}

function renderCourseCard(course) {
  const title = getLocalized(course, 'title');
  const description = getLocalized(course, 'description');
  const year = t(`الفرقة ${['الأولى', 'الثانية', 'الثالثة', 'الرابعة'][Number(course.academic_year) - 1]}`,
    `Year ${course.academic_year}`);
  const card = document.createElement('article');
  card.className = 'course-card tilt-card';
  card.innerHTML = `
    <div class="card-top"><span class="course-tag">${escapeHtml(year)}</span><span class="course-price">${escapeHtml(course.price)} ${t('ج.م', 'EGP')}</span></div>
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(description)}</p>
    <div class="meta-row"><span>${t('متاح الآن', 'Available now')}</span><span>${t('تقييم', 'Rating')} ${Number(course.average_rating || 0).toFixed(1)} / 5</span></div>
    <a href="course-details.html?id=${encodeURIComponent(course.id)}" class="link-pill">${t('عرض التفاصيل', 'View details')}</a>
  `;
  return card;
}

async function renderCourseCatalog() {
  const grids = [...document.querySelectorAll('.course-grid')];
  if (!grids.length || !appState.client) return;
  const courses = await loadCourses();
  const visibleCourses = courses.filter((course) => course.is_active || isAdmin());

  if (document.querySelector('.year-panel')) {
    document.querySelectorAll('.year-panel').forEach((panel) => {
      const grid = panel.querySelector('.course-grid');
      const year = panel.dataset.panel;
      grid.replaceChildren(...visibleCourses.filter((course) => course.academic_year === year).map(renderCourseCard));
    });
  } else {
    const grid = grids[0];
    grid.replaceChildren(...visibleCourses.slice(0, 3).map(renderCourseCard));
  }
}

async function loadCourseDetails() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id || !appState.client) return;
  const { data, error } = await appState.client.from('courses').select('*').eq('id', id).single();
  if (error) return reportError(error);
  const title = getLocalized(data, 'title');
  const description = getLocalized(data, 'description');
  document.querySelector('.details-panel h1')?.replaceChildren(document.createTextNode(title));
  const paragraph = document.querySelector('.details-panel > p');
  if (paragraph) paragraph.textContent = description;
  document.querySelector('.detail-header .course-tag')?.replaceChildren(document.createTextNode(title));
  document.querySelector('.detail-header .course-price')?.replaceChildren(
    document.createTextNode(`${data.price} ${t('ج.م', 'EGP')}`)
  );
  const enrollButton = document.getElementById('enrollCourseButton');
  if (enrollButton) {
    enrollButton.onclick = () => requestEnrollment(data.id);
  }
  const videoFrame = document.querySelector('.video-frame');
  if (videoFrame && data.video_path) {
    const videoUrl = await resolveCourseVideoUrl(data.video_path);
    if (videoUrl) {
      videoFrame.replaceChildren();
      const video = document.createElement('video');
      video.className = 'course-detail-video';
      video.setAttribute('controls', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('preload', 'metadata');
      bindCourseVideo(video, videoUrl, data.video_path);
      videoFrame.appendChild(video);
    } else {
      console.error('Course video URL could not be resolved.', { courseId: data.id, videoPath: data.video_path });
    }
  }
  const lessonResult = await appState.client.from('course_videos')
    .select('id,title_ar,title_en,video_source,sort_order')
    .eq('course_id', data.id).order('sort_order');
  if (!lessonResult.error && lessonResult.data?.length) {
    const extra = document.createElement('div');
    extra.className = 'course-video-lessons';
    for (const lesson of lessonResult.data) {
      const card = document.createElement('article');
      card.className = 'glass-card lesson-video-card';
      const title = document.createElement('h3');
      title.textContent = getLocalized(lesson, 'title');
      const frame = document.createElement('div');
      frame.className = 'lesson-video-frame';
      const source = await resolveCourseVideoUrl(lesson.video_source);
      if (source) {
        const video = document.createElement('video');
        video.controls = true;
        video.playsInline = true;
        bindCourseVideo(video, source, /^https?:\/\//i.test(lesson.video_source) ? null : lesson.video_source);
        frame.appendChild(video);
      } else {
        frame.textContent = t('تعذر تحميل الفيديو.', 'The video could not be loaded.');
      }
      card.append(title, frame);
      extra.appendChild(card);
    }
    document.querySelector('.course-detail-shell')?.after(extra);
  }
  await renderCourseReviews(data.id);
  if (appState.user) await renderCourseSchedule(data.id);
}

async function requestEnrollment(courseId) {
  if (!appState.user) {
    location.href = 'login.html?next=dashboard.html';
    return;
  }
  const { error } = await appState.client.rpc('request_course_enrollment', { p_course_id: courseId });
  if (error) return reportError(error);
  showToast(t('تم استلام طلبك، بانتظار مراجعة الإدارة.', 'Your request was received and is awaiting admin approval.'));
}

async function loadDashboard() {
  if (!appState.client || !appState.user) return;
  const { data: profile, error: profileError } = await appState.client
    .from('profiles')
    .select('*')
    .eq('id', appState.user.id)
    .single();
  if (profileError) throw profileError;
  appState.profile = profile;
  document.getElementById('studentName')?.replaceChildren(document.createTextNode(profile.full_name));
  document.getElementById('studentFaculty')?.replaceChildren(document.createTextNode(profile.faculty || ''));
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    ['full_name', 'faculty', 'academic_year', 'phone'].forEach((field) => {
      const input = profileForm.elements.namedItem(field);
      if (input) input.value = profile[field] || '';
    });
  }

  const [{ data: enrollments, error: enrollmentError }, { data: schedules, error: scheduleError }] = await Promise.all([
    appState.client.from('enrollments').select('id,status,access_code,course:courses(id,title_ar,title_en,video_path)')
      .eq('profile_id', profile.id).order('created_at', { ascending: false }),
    appState.client.from('course_schedules').select('*,course:courses(title_ar,title_en)')
      .gte('starts_at', new Date().toISOString()).order('starts_at').limit(20),
  ]);
  if (enrollmentError) throw enrollmentError;
  if (scheduleError) throw scheduleError;

  const courseList = document.getElementById('studentCourses');
  if (courseList) {
    courseList.replaceChildren();
    if (!enrollments.length) courseList.textContent = t('لا توجد بيانات حتى الآن.', 'Nothing here yet.');
    for (const enrollment of enrollments) {
      const item = document.createElement('article');
      item.className = 'course-item';
      const name = document.createElement('strong');
      name.textContent = getLocalized(enrollment.course, 'title');
      const status = document.createElement('small');
      status.textContent = statusLabel(enrollment.status);
      const code = document.createElement('span');
      code.className = 'access-code';
      code.textContent = enrollment.status === 'approved'
        ? enrollment.access_code
        : statusLabel(enrollment.status);
      item.append(name, status, code);
      if (enrollment.status === 'approved' && enrollment.course.video_path) {
        const videoUrl = await resolveCourseVideoUrl(enrollment.course.video_path);
        if (videoUrl) {
          const videoShell = document.createElement('div');
          videoShell.className = 'dashboard-video-shell';
          const video = document.createElement('video');
          video.className = 'dashboard-course-video';
          video.setAttribute('controls', '');
          video.setAttribute('playsinline', '');
          bindCourseVideo(video, videoUrl, enrollment.course.video_path);
          videoShell.appendChild(video);
          item.appendChild(videoShell);
        } else {
          console.error('Course video URL could not be resolved.', {
            courseId: enrollment.course.id,
            videoPath: enrollment.course.video_path,
          });
        }
      }
      courseList.appendChild(item);
    }
  }
  const count = document.getElementById('enrolledCount');
  if (count) count.textContent = String(enrollments.filter((item) => item.status === 'approved').length);
  const scheduleList = document.getElementById('studentSchedule');
  if (scheduleList) {
    scheduleList.replaceChildren(...schedules.map((schedule) => {
      const row = document.createElement('article');
      row.className = 'schedule-item';
      const title = document.createElement('strong');
      title.textContent = getLocalized(schedule, 'title');
      const course = document.createElement('span');
      course.textContent = getLocalized(schedule.course, 'title');
      const date = document.createElement('time');
      date.dateTime = schedule.starts_at;
      date.textContent = formatDate(schedule.starts_at);
      row.append(title, course, date);
      return row;
    }));
    if (!schedules.length) scheduleList.textContent = t('لا توجد بيانات حتى الآن.', 'Nothing here yet.');
  }
  await renderMyReviews();
}

function statusLabel(status) {
  const labels = {
    pending: t('قيد المراجعة', 'Pending'),
    approved: t('مقبول', 'Approved'),
    rejected: t('مرفوض', 'Rejected'),
  };
  return labels[status] || status;
}

async function saveProfile(event) {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const update = Object.fromEntries(['full_name', 'faculty', 'academic_year', 'phone']
    .map((key) => [key, String(values.get(key) || '').trim()]));
  const { error } = await appState.client.from('profiles').update(update).eq('id', appState.user.id);
  if (error) return reportError(error);
  showToast(t('تم تحديث البيانات بنجاح.', 'Your changes were saved.'));
  await loadDashboard();
}

async function renderCourseReviews(courseId) {
  const list = document.getElementById('courseReviews');
  if (!list) return;
  const { data, error } = await appState.client.from('course_reviews')
    .select('rating,comment,created_at')
    .eq('course_id', courseId).order('created_at', { ascending: false });
  if (error) return reportError(error);
  list.replaceChildren(...data.map((review) => {
    const article = document.createElement('article');
    article.className = 'review-item';
    const header = document.createElement('strong');
    header.textContent = `${t('تقييم طالب', 'Student review')} · ${'★'.repeat(review.rating)}`;
    const comment = document.createElement('p');
    comment.textContent = review.comment;
    article.append(header, comment);
    return article;
  }));
  const average = data.length ? data.reduce((sum, item) => sum + item.rating, 0) / data.length : 0;
  const rating = document.getElementById('courseAverageRating');
  if (rating) rating.textContent = `${average.toFixed(1)} / 5 (${data.length})`;
  const inlineRating = document.getElementById('courseInlineRating');
  if (inlineRating) inlineRating.textContent = `${average.toFixed(1)} / 5`;
  const form = document.getElementById('courseReviewForm');
  let canReview = false;
  if (appState.user) {
    const enrollment = await appState.client.from('enrollments').select('id')
      .eq('profile_id', appState.user.id).eq('course_id', courseId).eq('status', 'approved').maybeSingle();
    if (enrollment.error) return reportError(enrollment.error);
    canReview = Boolean(enrollment.data);
  }
  if (form && canReview) {
    form.hidden = false;
    form.onsubmit = async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const result = await appState.client.from('course_reviews').upsert({
        profile_id: appState.user.id,
        course_id: courseId,
        rating: Number(values.get('rating')),
        comment: String(values.get('comment') || '').trim(),
      }, { onConflict: 'profile_id,course_id' });
      if (result.error) return reportError(result.error);
      showToast(t('تم حفظ التقييم.', 'Your review was saved.'));
      await renderCourseReviews(courseId);
    };
  }
}

async function renderMyReviews() {
  const list = document.getElementById('myReviews');
  if (!list) return;
  const { data, error } = await appState.client.from('course_reviews')
    .select('rating,comment,course:courses(title_ar,title_en)')
    .eq('profile_id', appState.user.id);
  if (error) throw error;
  list.replaceChildren(...data.map((review) => {
    const row = document.createElement('article');
    row.className = 'review-item';
    row.textContent = `${getLocalized(review.course, 'title')} · ${'★'.repeat(review.rating)}${review.comment ? ` — ${review.comment}` : ''}`;
    return row;
  }));
  if (!data.length) list.textContent = t('لا توجد بيانات حتى الآن.', 'Nothing here yet.');
}

async function renderCourseSchedule(courseId) {
  const list = document.getElementById('courseSchedule');
  if (!list) return;
  const { data, error } = await appState.client.from('course_schedules')
    .select('title_ar,title_en,starts_at,meeting_url')
    .eq('course_id', courseId).gte('starts_at', new Date().toISOString()).order('starts_at');
  if (error) return reportError(error);
  list.replaceChildren(...data.map((schedule) => {
    const item = document.createElement('article');
    item.className = 'schedule-item';
    const title = document.createElement('strong');
    title.textContent = getLocalized(schedule, 'title');
    const date = document.createElement('time');
    date.textContent = formatDate(schedule.starts_at);
    item.append(title, date);
    if (schedule.meeting_url) {
      const url = safeHttpsUrl(schedule.meeting_url);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = t('رابط المحاضرة', 'Join session');
        item.appendChild(link);
      }
    }
    return item;
  }));
}

async function loadAdmin() {
  if (!appState.client || !isAdmin()) return;
  await Promise.all([
    loadCourses(),
    renderAdminRequests(),
    renderStudentDirectory(),
    renderAdminSchedules(),
    renderAdminReviews(),
  ]);
  populateCourseSelects();
  bindAdminForms();
}

async function saveSiteSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const settings = {
    facebook_url: String(values.get('facebook_url') || '').trim(),
    instagram_url: String(values.get('instagram_url') || '').trim(),
    tiktok_url: String(values.get('tiktok_url') || '').trim(),
    whatsapp_number: String(values.get('whatsapp_number') || '').trim(),
    updated_at: new Date().toISOString(),
    updated_by: appState.user.id,
  };
  for (const key of ['facebook_url', 'instagram_url', 'tiktok_url']) {
    if (settings[key] && !safeHttpsUrl(settings[key])) {
      showToast(t('يجب استخدام رابط آمن يبدأ بـ https://.', 'Each social link must be a valid https:// URL.'), true);
      return;
    }
  }
  const phoneDigits = settings.whatsapp_number.replace(/\D/g, '');
  if (settings.whatsapp_number && (phoneDigits.length < 8 || phoneDigits.length > 15)) {
    showToast(t('أدخل رقم واتساب مع مفتاح الدولة من 8 إلى 15 رقمًا.', 'Enter a WhatsApp number with country code, using 8 to 15 digits.'), true);
    return;
  }
  const { error } = await appState.client.from('site_settings').update(settings)
    .eq('id', 1).select('id').single();
  if (error) return reportError(error);
  showToast(t('تم حفظ روابط التواصل.', 'Contact links saved.'));
  await loadSiteSettings();
}

async function saveCopyrightSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const developerUrl = String(values.get('developer_url') || '').trim();
  const iconUrl = String(values.get('developer_icon_url') || '').trim();
  if (developerUrl && !safeHttpsUrl(developerUrl)) {
    showToast(t('يجب أن يبدأ رابط المطوّر بـ https://.', 'The developer URL must start with https://.'), true);
    return;
  }
  if (iconUrl && /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(iconUrl) && !safeHttpsUrl(iconUrl)) {
    showToast(t('يجب أن يكون مسار الأيقونة محليًا أو رابطًا آمنًا.', 'The icon must be a local path or a safe URL.'), true);
    return;
  }
  const update = {
    copyright_text_ar: String(values.get('copyright_text_ar') || '').trim() || 'جميع الحقوق محفوظة لدى R2J WEB DEV',
    copyright_text_en: String(values.get('copyright_text_en') || '').trim() || 'All rights reserved by R2J WEB DEV',
    developer_name: String(values.get('developer_name') || '').trim() || 'R2J WEB DEV',
    developer_url: developerUrl,
    developer_icon_url: iconUrl || 'assets/r2j-web-dev.png',
    updated_at: new Date().toISOString(),
    updated_by: appState.user.id,
  };
  const { error } = await appState.client.from('site_settings').update(update)
    .eq('id', 1).select('id').single();
  if (error) return reportError(error);
  showToast(t('تم حفظ حقوق الموقع.', 'Website credits saved.'));
  await loadSiteSettings();
}

async function saveSiteContent(event) {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const content = {};
  ['hero_title_ar', 'hero_title_en', 'hero_subtitle_ar', 'hero_subtitle_en',
    'courses_title_ar', 'courses_title_en', 'community_title_ar', 'community_title_en'].forEach((key) => {
    content[key] = String(values.get(key) || '').trim();
  });
  const { error } = await appState.client.from('site_settings').update(content).eq('id', 1);
  if (error) return reportError(error);
  showToast(t('تم حفظ محتوى الصفحات.', 'Page content saved.'));
  await loadSiteSettings();
}

function populateCourseSelects() {
  document.querySelectorAll('[data-course-select]').forEach((select) => {
    const selected = select.value;
    select.replaceChildren(new Option(t('اختر مقررًا', 'Select a course'), ''));
    appState.courses.forEach((course) => {
      select.add(new Option(getLocalized(course, 'title'), course.id));
    });
    select.value = selected;
  });
  const editSelect = document.getElementById('editCourseId');
  if (editSelect) {
    editSelect.replaceChildren(new Option(t('مقرر جديد', 'New course'), ''));
    appState.courses.forEach((course) => editSelect.add(new Option(getLocalized(course, 'title'), course.id)));
  }
}

async function renderAdminRequests() {
  const target = document.getElementById('adminRequests');
  if (!target) return;
  const { data, error } = await appState.client.from('enrollments')
    .select('id,status,created_at,profile:profiles(id,email,full_name,phone,academic_year),course:courses(title_ar,title_en)')
    .eq('status', 'pending').order('created_at');
  if (error) throw error;
  target.replaceChildren(...data.map((request) => {
    const row = document.createElement('article');
    row.className = 'request-item';
    const detail = document.createElement('div');
    const student = document.createElement('strong');
    student.textContent = request.profile.full_name;
    const course = document.createElement('small');
    course.textContent = `${getLocalized(request.course, 'title')} · ${request.profile.email} · ${request.profile.phone}`;
    detail.append(student, course);
    const actions = document.createElement('div');
    actions.className = 'request-actions';
    ['approved', 'rejected'].forEach((status) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = status === 'approved' ? 'approve-btn' : 'reject-btn';
      button.textContent = statusLabel(status);
      button.addEventListener('click', () => updateEnrollment(request.id, status));
      actions.appendChild(button);
    });
    row.append(detail, actions);
    return row;
  }));
  if (!data.length) target.textContent = t('لا توجد بيانات حتى الآن.', 'Nothing here yet.');
}

async function updateEnrollment(id, status) {
  const { error } = await appState.client.from('enrollments').update({ status }).eq('id', id);
  if (error) return reportError(error);
  showToast(t('تم تحديث حالة الطلب.', 'Enrollment status updated.'));
  await renderAdminRequests();
}

async function renderStudentDirectory() {
  const target = document.getElementById('studentDirectory');
  if (!target) return;
  const { data, error } = await appState.client.from('profiles')
    .select('id,email,full_name,phone,faculty,academic_year,role,account_status,muted_until,kicked_until').order('created_at', { ascending: false });
  if (error) throw error;
  target.replaceChildren();
  const header = document.createElement('div');
  header.className = 'directory-header';
  header.textContent = t('الاسم · البريد · الفرقة · الهاتف · الصلاحية',
    'Name · Email · Year · Phone · Role');
  target.appendChild(header);
  data.forEach((profile) => {
    const row = document.createElement('div');
    row.className = 'directory-row';
    const info = document.createElement('div');
    info.textContent = `${profile.full_name} · ${profile.email} · الفرقة ${profile.academic_year} · ${profile.phone} · ${profile.role}`;
    const actions = document.createElement('div');
    actions.className = 'moderation-actions';
    const actionsConfig = [
      ['mute', 'كتم 30 د'],
      ['kick', 'طرد 30 د'],
      ['ban', profile.account_status === 'banned' ? 'إلغاء الحظر' : 'حظر'],
      ['delete', 'حذف الحساب'],
    ];
    actionsConfig.forEach(([action, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      button.textContent = label;
      button.addEventListener('click', () => moderateProfile(profile, action));
      actions.appendChild(button);
    });
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'btn btn-secondary';
    reset.textContent = 'إرسال استعادة كلمة المرور';
    reset.addEventListener('click', () => sendPasswordRecovery(profile.email));
    actions.appendChild(reset);
    row.append(info, actions);
    target.appendChild(row);
  });
}

async function moderateProfile(profile, action) {
  if (profile.id === appState.user.id) {
    showToast('لا يمكنك تعديل حسابك الإداري الحالي.', true);
    return;
  }
  if (action === 'delete' && !confirm(`حذف حساب ${profile.email} نهائيًا؟ لا يمكن التراجع.`)) return;
  if (action === 'ban' && profile.account_status === 'banned') action = 'unban';
  const { error } = await appState.client.rpc('moderate_profile', {
    p_profile_id: profile.id,
    p_action: action,
    p_minutes: 30,
  });
  if (error) return reportError(error);
  showToast(action === 'delete' ? 'تم حذف الحساب.' : 'تم تنفيذ إجراء الحماية.');
  await renderStudentDirectory();
}

async function sendPasswordRecovery(email) {
  if (!appState.client) return;
  const { error } = await appState.client.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/update-password.html`,
  });
  if (error) return reportError(error);
  showToast('تم إرسال رابط استعادة كلمة المرور إلى بريد المستخدم.');
}

async function renderAdminSchedules() {
  const target = document.getElementById('adminScheduleList');
  if (!target) return;
  const { data, error } = await appState.client.from('course_schedules')
    .select('id,course_id,title_ar,title_en,starts_at,ends_at,meeting_url,course:courses(title_ar,title_en)')
    .order('starts_at', { ascending: true });
  if (error) throw error;
  target.replaceChildren(...data.map((schedule) => {
    const row = document.createElement('article');
    row.className = 'schedule-item';
    row.innerHTML = `<span>${escapeHtml(getLocalized(schedule, 'title'))} · ${escapeHtml(getLocalized(schedule.course, 'title'))} · ${escapeHtml(formatDate(schedule.starts_at))}</span>`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn btn-secondary';
    remove.textContent = t('حذف', 'Delete');
    remove.addEventListener('click', async () => {
      const result = await appState.client.from('course_schedules').delete().eq('id', schedule.id);
      if (result.error) return reportError(result.error);
      await renderAdminSchedules();
    });
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'btn btn-secondary';
    edit.textContent = t('تعديل', 'Edit');
    edit.addEventListener('click', () => {
      const form = document.getElementById('scheduleForm');
      form.elements.namedItem('schedule_id').value = schedule.id;
      form.elements.namedItem('course_id').value = schedule.course_id;
      form.elements.namedItem('title_ar').value = schedule.title_ar;
      form.elements.namedItem('title_en').value = schedule.title_en;
      form.elements.namedItem('starts_at').value = toLocalDateTime(schedule.starts_at);
      form.elements.namedItem('ends_at').value = schedule.ends_at ? toLocalDateTime(schedule.ends_at) : '';
      form.elements.namedItem('meeting_url').value = schedule.meeting_url || '';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    row.append(edit, remove);
    return row;
  }));
}

function toLocalDateTime(value) {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function bindAdminForms() {
  const courseForm = document.getElementById('courseAdminForm');
  if (courseForm && !courseForm.dataset.bound) {
    courseForm.dataset.bound = 'true';
    courseForm.addEventListener('submit', saveCourse);
  }
  const scheduleForm = document.getElementById('scheduleForm');
  if (scheduleForm && !scheduleForm.dataset.bound) {
    scheduleForm.dataset.bound = 'true';
    scheduleForm.addEventListener('submit', saveSchedule);
  }
  const announcementForm = document.getElementById('announcementForm');
  if (announcementForm && !announcementForm.dataset.bound) {
    announcementForm.dataset.bound = 'true';
    announcementForm.addEventListener('submit', publishAnnouncement);
  }
  const roleForm = document.getElementById('adminRoleForm');
  if (roleForm && !roleForm.dataset.bound) {
    roleForm.dataset.bound = 'true';
    roleForm.addEventListener('submit', setAdminRole);
  }
  const siteSettingsForm = document.getElementById('siteSettingsForm');
  if (siteSettingsForm && !siteSettingsForm.dataset.bound) {
    siteSettingsForm.dataset.bound = 'true';
    siteSettingsForm.addEventListener('submit', saveSiteSettings);
  }
  const copyrightSettingsForm = document.getElementById('copyrightSettingsForm');
  if (copyrightSettingsForm && !copyrightSettingsForm.dataset.bound) {
    copyrightSettingsForm.dataset.bound = 'true';
    copyrightSettingsForm.addEventListener('submit', saveCopyrightSettings);
  }
  const siteContentForm = document.getElementById('siteContentForm');
  if (siteContentForm && !siteContentForm.dataset.bound) {
    siteContentForm.dataset.bound = 'true';
    siteContentForm.addEventListener('submit', saveSiteContent);
  }
  const editSelect = document.getElementById('editCourseId');
  if (editSelect && !editSelect.dataset.bound) {
    editSelect.dataset.bound = 'true';
    editSelect.addEventListener('change', fillCourseForm);
  }
}

function fillCourseForm(event) {
  const form = document.getElementById('courseAdminForm');
  const course = appState.courses.find((item) => item.id === event.target.value);
  if (!form) return;
  form.elements.namedItem('title_ar').value = course?.title_ar || '';
  form.elements.namedItem('title_en').value = course?.title_en || '';
  form.elements.namedItem('description_ar').value = course?.description_ar || '';
  form.elements.namedItem('description_en').value = course?.description_en || '';
  form.elements.namedItem('price').value = course?.price || '';
  form.elements.namedItem('academic_year').value = course?.academic_year || '';
  form.elements.namedItem('video_path').value = course?.video_path || '';
  form.elements.namedItem('is_active').checked = course?.is_active ?? true;
}

async function saveCourse(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const editId = String(values.get('edit_id') || '');
  const video = form.elements.namedItem('video_file').files[0];
  if (video && video.size > 50 * 1024 * 1024) {
    showToast(t('الحد الأقصى لحجم الفيديو 50 ميغابايت.', 'The video upload limit is 50 MB.'), true);
    return;
  }
  const courseData = {
    title_ar: String(values.get('title_ar')).trim(),
    title_en: String(values.get('title_en')).trim(),
    description_ar: String(values.get('description_ar')).trim(),
    description_en: String(values.get('description_en')).trim(),
    price: Number(values.get('price')),
    academic_year: String(values.get('academic_year')),
    video_path: String(values.get('video_path') || '').trim() || null,
    is_active: form.elements.namedItem('is_active').checked,
  };
  const result = editId
    ? await appState.client.from('courses').update(courseData).eq('id', editId).select().single()
    : await appState.client.from('courses').insert(courseData).select().single();
  if (result.error) return reportError(result.error);

  if (video) {
    const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${result.data.id}/${Date.now()}-${safeName}`;
    const upload = await appState.client.storage.from('course-videos').upload(path, video, { upsert: true });
    if (upload.error) return reportError(upload.error);
    const update = await appState.client.from('courses').update({ video_path: path }).eq('id', result.data.id);
    if (update.error) return reportError(update.error);
  }

  const extraSources = String(values.get('video_sources') || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (extraSources.length) {
    await appState.client.from('course_videos').delete().eq('course_id', result.data.id);
    const lessons = extraSources.map((line, index) => {
      const separator = line.indexOf('|');
      return {
        course_id: result.data.id,
        title_ar: separator >= 0 ? line.slice(0, separator).trim() : `درس ${index + 1}`,
        title_en: separator >= 0 ? line.slice(0, separator).trim() : `Lesson ${index + 1}`,
        video_source: separator >= 0 ? line.slice(separator + 1).trim() : line,
        sort_order: index,
      };
    }).filter((lesson) => lesson.video_source);
    if (lessons.length) {
      const lessonResult = await appState.client.from('course_videos').insert(lessons);
      if (lessonResult.error) return reportError(lessonResult.error);
    }
  }

  showToast(t('تم حفظ المقرر.', 'Course saved.'));
  form.reset();
  await loadAdmin();
  await renderCourseCatalog();
}

async function saveSchedule(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const schedule = {
    course_id: String(values.get('course_id')),
    title_ar: String(values.get('title_ar')).trim(),
    title_en: String(values.get('title_en')).trim(),
    starts_at: new Date(String(values.get('starts_at'))).toISOString(),
    ends_at: values.get('ends_at') ? new Date(String(values.get('ends_at'))).toISOString() : null,
    meeting_url: String(values.get('meeting_url') || '').trim() || null,
  };
  if (schedule.meeting_url && !safeHttpsUrl(schedule.meeting_url)) {
    showToast(t('يجب أن يبدأ رابط اللقاء بـ https://.', 'Meeting links must use https://.'), true);
    return;
  }
  const scheduleId = String(values.get('schedule_id') || '');
  const { error } = scheduleId
    ? await appState.client.from('course_schedules').update(schedule).eq('id', scheduleId)
    : await appState.client.from('course_schedules').insert(schedule);
  if (error) return reportError(error);
  showToast(t('تم حفظ الموعد.', 'Schedule saved.'));
  form.reset();
  await renderAdminSchedules();
}

async function publishAnnouncement(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const { error } = await appState.client.from('announcements').insert({
    title_ar: String(values.get('title_ar')).trim(),
    title_en: String(values.get('title_en')).trim(),
    body_ar: String(values.get('body_ar')).trim(),
    body_en: String(values.get('body_en')).trim(),
    created_by: appState.user.id,
  });
  if (error) return reportError(error);
  showToast(t('تم نشر الإشعار.', 'Announcement published.'));
  form.reset();
}

async function setAdminRole(event) {
  event.preventDefault();
  const values = new FormData(event.currentTarget);
  const email = String(values.get('email')).trim().toLowerCase();
  const role = String(values.get('role'));
  const { data: profile, error: findError } = await appState.client.from('profiles')
    .select('id').eq('email', email).maybeSingle();
  if (findError) return reportError(findError);
  if (!profile) {
    showToast(t('لم يتم العثور على حساب بهذا البريد.', 'No account was found for this email.'), true);
    return;
  }
  if (profile.id === appState.user.id && role !== 'admin') {
    showToast(t('لا يمكنك إزالة صلاحية المسؤول من حسابك الحالي.', 'You cannot remove your own administrator role.'), true);
    return;
  }
  const { error } = await appState.client.from('profiles').update({ role }).eq('id', profile.id);
  if (error) return reportError(error);
  showToast(t('تم تحديث البيانات بنجاح.', 'Your changes were saved.'));
  await renderStudentDirectory();
}

async function loadCommunityMessages() {
  const publicList = document.getElementById('publicChatMessages');
  const privateList = document.getElementById('privateChatMessages');
  if (!appState.client || !appState.user || (!publicList && !privateList)) return;
  const selectedCourse = document.getElementById('privateCourseSelect')?.value;
  const loadList = async (target, courseId) => {
    if (!target) return;
    let query = appState.client.from('community_messages')
      .select('id,profile_id,sender_name,body,created_at').order('created_at').limit(100);
    query = courseId ? query.eq('course_id', courseId) : query.is('course_id', null);
    const { data, error } = await query;
    if (error) throw error;
    target.replaceChildren(...data.map((message) => {
      const row = document.createElement('div');
      row.className = 'chat-message';
      const sender = document.createElement('strong');
      sender.textContent = `${message.sender_name}: `;
      const body = document.createElement('span');
      body.textContent = message.body;
      row.append(sender, body);
      if (isAdmin() || message.profile_id === appState.user.id) {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'chat-delete';
        remove.textContent = t('حذف', 'Delete');
        remove.addEventListener('click', async () => {
          if (!confirm(t('حذف هذه الرسالة؟', 'Delete this message?'))) return;
          const result = await appState.client.from('community_messages').delete().eq('id', message.id);
          if (result.error) return reportError(result.error);
          await loadCommunityMessages();
        });
        row.appendChild(remove);
      }
      return row;
    }));
  };
  await loadList(publicList, null);
  if (selectedCourse) await loadList(privateList, selectedCourse);
}

function restrictCommunityChat() {
  if (appState.user) return;
  document.querySelectorAll('#publicChatInput, #sendPublicChat, #privateChatInput, #sendPrivateChat')
    .forEach((control) => { control.disabled = true; });
  document.querySelectorAll('#publicChatMessages, #privateChatMessages').forEach((list) => {
    list.textContent = t('سجّل الدخول لعرض المحادثات وإرسال الرسائل.', 'Sign in to view conversations and send messages.');
  });
}

let activeCallRoom = null;
let callPeer = null;
let callStream = null;
let callChannel = null;

async function loadCallRooms() {
  const select = document.getElementById('callRoomSelect');
  if (!select || !appState.client || !appState.user) return;
  const { data, error } = await appState.client.from('call_rooms')
    .select('id,title,room_type,created_by').order('created_at', { ascending: false }).limit(100);
  if (error) return reportError(error);
  select.replaceChildren(new Option(t('اختر غرفة', 'Select a room'), ''));
  (data || []).forEach((room) => select.add(new Option(room.title, room.id)));
}

function bindCallControls() {
  const create = document.getElementById('createCallRoom');
  const join = document.getElementById('joinCallRoom');
  const leave = document.getElementById('leaveCallRoom');
  if (create) create.addEventListener('click', async () => {
    if (!appState.user) return location.href = 'login.html';
    const title = prompt(t('اسم غرفة المكالمة', 'Call room name'), t('اجتماع قانوني', 'Law meeting'));
    if (!title?.trim()) return;
    const { data, error } = await appState.client.from('call_rooms').insert({
      title: title.trim(),
      room_type: 'group',
      created_by: appState.user.id,
    }).select().single();
    if (error) return reportError(error);
    await loadCallRooms();
    document.getElementById('callRoomSelect').value = data.id;
  });
  if (join) join.addEventListener('click', joinCallRoom);
  if (leave) leave.addEventListener('click', leaveCallRoom);
}

async function joinCallRoom() {
  const roomId = document.getElementById('callRoomSelect')?.value;
  if (!roomId || !appState.user) return;
  if (appState.profile?.kicked_until && new Date(appState.profile.kicked_until) > new Date()) {
    showToast(t('تم طردك مؤقتًا من المكالمات.', 'You are temporarily removed from calls.'), true);
    return;
  }
  try {
    callStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  } catch (error) {
    return reportError(error);
  }
  activeCallRoom = roomId;
  document.getElementById('localCallVideo').srcObject = callStream;
  await appState.client.from('call_participants').upsert({
    room_id: roomId,
    profile_id: appState.user.id,
    left_at: null,
  }, { onConflict: 'room_id,profile_id' });
  callPeer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  callStream.getTracks().forEach((track) => callPeer.addTrack(track, callStream));
  callPeer.ontrack = (event) => {
    document.getElementById('remoteCallVideo').srcObject = event.streams[0];
  };
  callPeer.onicecandidate = async (event) => {
    if (!event.candidate) return;
    await appState.client.from('call_signals').insert({
      room_id: roomId,
      sender_id: appState.user.id,
      signal: { candidate: event.candidate },
    });
  };
  const offer = await callPeer.createOffer();
  await callPeer.setLocalDescription(offer);
  await appState.client.from('call_signals').insert({
    room_id: roomId,
    sender_id: appState.user.id,
    signal: { description: callPeer.localDescription },
  });
  callChannel = appState.client.channel(`call-${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'call_signals',
      filter: `room_id=eq.${roomId}`,
    }, async ({ new: signal }) => {
      if (!callPeer || signal.sender_id === appState.user.id) return;
      if (signal.signal.description) {
        await callPeer.setRemoteDescription(signal.signal.description);
        if (signal.signal.description.type === 'offer') {
          const answer = await callPeer.createAnswer();
          await callPeer.setLocalDescription(answer);
          await appState.client.from('call_signals').insert({
            room_id: roomId,
            sender_id: appState.user.id,
            receiver_id: signal.sender_id,
            signal: { description: callPeer.localDescription },
          });
        }
      } else if (signal.signal.candidate) {
        await callPeer.addIceCandidate(signal.signal.candidate);
      }
    })
    .subscribe();
  document.getElementById('joinCallRoom').hidden = true;
  document.getElementById('leaveCallRoom').hidden = false;
  await renderCallParticipants(roomId);
}

async function leaveCallRoom() {
  if (activeCallRoom && appState.user) {
    await appState.client.from('call_participants').update({ left_at: new Date().toISOString() })
      .eq('room_id', activeCallRoom).eq('profile_id', appState.user.id);
  }
  callStream?.getTracks().forEach((track) => track.stop());
  callPeer?.close();
  if (callChannel) appState.client.removeChannel(callChannel);
  activeCallRoom = null;
  callPeer = null;
  callStream = null;
  document.getElementById('joinCallRoom').hidden = false;
  document.getElementById('leaveCallRoom').hidden = true;
  document.getElementById('localCallVideo').srcObject = null;
  document.getElementById('remoteCallVideo').srcObject = null;
  document.getElementById('callParticipants').replaceChildren();
}

async function renderCallParticipants(roomId) {
  const target = document.getElementById('callParticipants');
  if (!target) return;
  const { data, error } = await appState.client.from('call_participants')
    .select('profile_id,joined_at,left_at,profile:profiles(full_name,role)')
    .eq('room_id', roomId).is('left_at', null);
  if (error) return reportError(error);
  target.replaceChildren(...(data || []).map((participant) => {
    const item = document.createElement('span');
    item.className = 'call-participant';
    item.textContent = `${participant.profile?.full_name || ''} · ${participant.profile?.role === 'admin' ? t('مسؤول', 'Administrator') : t('طالب', 'Student')}`;
    return item;
  }));
}

function bindCommunityChat() {
  const formBindings = [
    { input: document.getElementById('publicChatInput'), button: document.getElementById('sendPublicChat'), courseId: null },
    { input: document.getElementById('privateChatInput'), button: document.getElementById('sendPrivateChat'), private: true },
  ];
  formBindings.forEach(({ input, button, courseId, private: isPrivate }) => {
    if (!input || !button) return;
    button.addEventListener('click', async () => {
      if (!appState.user) {
        location.href = 'login.html';
        return;
      }
      if (appState.profile?.muted_until && new Date(appState.profile.muted_until) > new Date()) {
        showToast(t('تم كتم حسابك مؤقتًا.', 'Your account is temporarily muted.'), true);
        return;
      }
      const body = input.value.trim();
      const selectedCourse = isPrivate ? document.getElementById('privateCourseSelect')?.value : courseId;
      if (!body || (isPrivate && !selectedCourse)) return;
      const { error } = await appState.client.from('community_messages').insert({
        profile_id: appState.user.id,
        course_id: selectedCourse || null,
        body,
      });
      if (error) return reportError(error);
      input.value = '';
      await loadCommunityMessages();
    });
  });
  document.getElementById('privateCourseSelect')?.addEventListener('change', () => {
    loadCommunityMessages().catch(reportError);
  });
}

async function populateCommunityCourses() {
  const select = document.getElementById('privateCourseSelect');
  if (!select || !appState.user) return;
  const { data, error } = await appState.client.from('enrollments')
    .select('course_id,course:courses(title_ar,title_en)')
    .eq('profile_id', appState.user.id).eq('status', 'approved');
  if (error) return reportError(error);
  select.replaceChildren(new Option(t('اختر مقررًا', 'Select a course'), ''));
  data.forEach((enrollment) => {
    select.add(new Option(getLocalized(enrollment.course, 'title'), enrollment.course_id));
  });
}

async function renderAdminReviews() {
  const target = document.getElementById('adminReviews');
  if (!target || !isAdmin()) return;
  const { data, error } = await appState.client.from('course_reviews')
    .select('id,rating,comment,created_at,course:courses(title_ar,title_en),profile:profiles(full_name,email)')
    .order('created_at', { ascending: false }).limit(100);
  if (error) return reportError(error);
  target.replaceChildren(...data.map((review) => {
    const row = document.createElement('article');
    row.className = 'review-item';
    const detail = document.createElement('span');
    detail.textContent = `${getLocalized(review.course, 'title')} · ${review.profile?.full_name || ''} · ${'★'.repeat(review.rating)} · ${review.comment}`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'btn btn-secondary';
    remove.textContent = t('حذف', 'Delete');
    remove.addEventListener('click', async () => {
      const result = await appState.client.from('course_reviews').delete().eq('id', review.id);
      if (result.error) return reportError(result.error);
      await renderAdminReviews();
    });
    row.append(detail, remove);
    return row;
  }));
}

function bindDashboardTabs() {
  const tabs = document.querySelectorAll('[data-dashboard-tab]');
  if (!tabs.length) return;
  tabs.forEach((tab) => tab.addEventListener('click', () => {
    const active = tab.dataset.dashboardTab;
    tabs.forEach((item) => item.classList.toggle('active', item === tab));
    document.querySelectorAll('[data-dashboard-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.dashboardPanel !== active;
    });
  }));
}

function bindPageTabs() {
  document.querySelectorAll('.year-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.year-tab').forEach((item) => item.classList.toggle('active', item === tab));
      document.querySelectorAll('.year-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === tab.dataset.year);
      });
    });
  });
  document.querySelectorAll('.community-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.community-tab').forEach((item) => item.classList.toggle('active', item === tab));
      document.querySelectorAll('.community-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === tab.dataset.tab);
      });
    });
  });
}

function initPageLoader() {
  const loader = document.createElement('div');
  loader.className = 'site-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', t('جاري تحميل الموقع', 'Loading'));
  loader.innerHTML = `<div class="loader-content"><div class="loader-logo-wrap"><img class="loader-logo" src="assets/logo.png" alt=""></div><div class="loader-title">${t('مركز الإسراء للحقوق', 'Al-Israa Law Center')}</div><div class="loader-progress"></div></div>`;
  document.body.prepend(loader);
  const started = performance.now();
  let dismissed = false;
  const hide = () => {
    if (dismissed) return;
    dismissed = true;
    setTimeout(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 700);
    }, Math.max(0, 900 - (performance.now() - started)));
  };
  if (document.readyState === 'complete') hide();
  else {
    window.addEventListener('load', hide, { once: true });
    setTimeout(hide, 5000);
  }
}

function showLoginWelcome() {
  const welcomeName = sessionStorage.getItem('al_israa_welcome_name');
  if (!welcomeName) return;
  sessionStorage.removeItem('al_israa_welcome_name');
  sessionStorage.removeItem('al_israa_welcome_language');
  const welcome = document.createElement('div');
  welcome.className = 'login-welcome';
  welcome.setAttribute('role', 'status');
  welcome.setAttribute('aria-live', 'polite');
  welcome.innerHTML = `
    <div class="welcome-orbit" aria-hidden="true">
      <span class="welcome-ring"></span>
      <img src="assets/logo.png" alt="">
      <span class="welcome-spark spark-one"></span>
      <span class="welcome-spark spark-two"></span>
      <span class="welcome-spark spark-three"></span>
    </div>
    <div class="welcome-copy">
      <span class="welcome-kicker">${t('تم تسجيل الدخول بنجاح', 'Signed in successfully')}</span>
      <strong>${t('أهلاً بك', 'Welcome')}, ${escapeHtml(welcomeName)}</strong>
    </div>
  `;
  document.body.appendChild(welcome);
  window.setTimeout(() => welcome.classList.add('is-visible'), 30);
  window.setTimeout(() => {
    welcome.classList.add('is-leaving');
    window.setTimeout(() => welcome.remove(), 550);
  }, 2800);
}

async function initialize() {
  initPageLoader();
  applyTheme();
  applyLanguage();
  showLoginWelcome();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch((error) => console.error(error));
  }
  document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });
  bindAuthForms();
  bindDashboardTabs();
  bindPageTabs();
  addCaptchaWidget();
  document.getElementById('profileForm')?.addEventListener('submit', (event) => {
    saveProfile(event).catch(reportError);
  });
  bindCommunityChat();
  bindCallControls();

  appState.client = getClient();
  if (!appState.client) {
    updateNavigation();
    const path = location.pathname.toLowerCase();
    if (path.endsWith('dashboard.html') || path.endsWith('admin.html')) {
      showToast(t('أكمل إعداد Supabase قبل استخدام لوحة الحساب.', 'Configure Supabase before using account pages.'), true);
      location.replace('login.html');
    }
    if (document.querySelector('form#loginForm, form#registerForm, form#forgotForm')) {
      showToast(t('أكمل إعداد Supabase في js/config.js أولاً.', 'Configure Supabase in js/config.js first.'), true);
    }
    return;
  }

  try {
    await loadSiteSettings();
  } catch (error) {
    reportError(error);
  }

  const { data: sessionData, error: sessionError } = await appState.client.auth.getSession();
  if (sessionError) return reportError(sessionError);
  appState.user = sessionData.session?.user || null;
  if (appState.user && !appState.user.email_confirmed_at) {
    await appState.client.auth.signOut();
    appState.user = null;
    showToast(t('يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول.', 'Confirm your email before signing in.'), true);
  }
  updateNavigation();
  await renderCourseCatalog();
  if (appState.user) {
    try {
      await loadProfile();
      if (appState.profile?.account_status === 'banned') {
        await appState.client.auth.signOut();
        appState.user = null;
        showToast(t('تم حظر هذا الحساب.', 'This account has been banned.'), true);
        return;
      }
      updateNavigation();
      await guardPage();
      await loadAnnouncements();
      subscribeToAnnouncements();
      await renderCourseCatalog();
      await loadDashboard();
      await loadAdmin();
      await populateCommunityCourses();
      await loadCommunityMessages();
      await loadCallRooms();
    } catch (error) {
      reportError(error);
    }
  } else {
    await guardPage();
    restrictCommunityChat();
  }
  await loadCourseDetails();

  appState.client.auth.onAuthStateChange((_event, session) => {
    appState.user = session?.user || null;
    if (!appState.user) appState.profile = null;
    updateNavigation();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initialize().catch(reportError);
});
