from setuptools import setup, find_packages

setup(
    name='sentiment-analysis-social-media',
    version='0.1.0',
    author='Your Name',
    author_email='your.email@example.com',
    description='A sentiment analysis tool for social media data.',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[
        'Flask',
        'pandas',
        'scikit-learn',
        'numpy',
        'requests',
        'dotenv'
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)